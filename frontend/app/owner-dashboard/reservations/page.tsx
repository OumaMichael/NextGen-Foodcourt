'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Users, Clock, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';


interface Reservation {
  id: number;
  user_id: number;
  table_id: number;
  booking_date: string;
  booking_time: string;
  status: string;
  no_of_people: number;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
  table?: {
    table_number: number;
    capacity: number;
  };
}

interface Table {
  id: number;
  table_number: number;
  capacity: number;
  status: string;
  is_available?: string;
}

interface FormErrors {
  customerName?: string;
  customerEmail?: string;
  table_id?: string;
  booking_date?: string;
  booking_time?: string;
  no_of_people?: string;
  general?: string;
}

export default function ReservationManagement() {
  const { selectedOutlet } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [newReservation, setNewReservation] = useState({
    customerName: '',
    customerEmail: '',
    table_id: 1,
    booking_date: '',
    booking_time: '',
    no_of_people: 2
  });

  const isOwner = typeof window !== 'undefined' && localStorage.getItem('userType') === 'owner';

    useEffect(() => {
    const fetchReservationData = async () => {
      try {
        setLoading(true);
        
        const [reservationsRes, tablesRes] = await Promise.all([
          fetch('http://localhost:5555/reservations'),
          fetch('http://localhost:5555/tables')
        ]);

        const reservationsData = await reservationsRes.json();
        const tablesData = await tablesRes.json();

        setReservations(reservationsData);
        setTables(tablesData);
      } catch (error) {
        console.error('Failed to fetch reservation data:', error);
        setReservations([]);
        setTables([
          { id: 1, table_number: 1, capacity: 4, status: 'available', is_available: 'Yes' },
          { id: 2, table_number: 2, capacity: 6, status: 'available', is_available: 'Yes' },
          { id: 3, table_number: 3, capacity: 4, status: 'reserved', is_available: 'No' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (isOwner) {
      fetchReservationData();
    }
  }, [isOwner]);


  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!newReservation.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!newReservation.customerEmail.trim()) {
      newErrors.customerEmail = 'Customer email is required';
    } else if (!/\S+@\S+\.\S+/.test(newReservation.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    if (!newReservation.booking_date) {
      newErrors.booking_date = 'Booking date is required';
    } else {
      const selectedDate = new Date(newReservation.booking_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.booking_date = 'Booking date cannot be in the past';
      }
    }

    if (!newReservation.booking_time) {
      newErrors.booking_time = 'Booking time is required';
    }

    if (!newReservation.table_id) {
      newErrors.table_id = 'Please select a table';
    }

    if (newReservation.no_of_people < 1 || newReservation.no_of_people > 12) {
      newErrors.no_of_people = 'Number of people must be between 1 and 12';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatBookingDate = (dateString: string): string => {
    return dateString;
  };

  const formatBookingTime = (timeString: string): string => {
    // Convert HH:MM to HH:MM:SS format
    if (timeString.includes(':')) {
      const parts = timeString.split(':');
      if (parts.length === 2) {
        return `${timeString}:00`;
      }
    }
    return timeString;
  };


const handleAddReservation = async () => {
  setErrors({});

  if (!validateForm()) {
    Swal.fire({
      icon: 'warning',
      title: 'Invalid Input',
      text: 'Please fill out all required fields correctly.',
    });
    return;
  }

  setSubmitting(true);

  try {
    const userResponse = await fetch('http://localhost:5555/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newReservation.customerName.trim(),
        email: newReservation.customerEmail.trim(),
        password: 'temppass123',
        phone_no: '0700000000',
        role: 'customer'
      })
    });

    let userId = 1; 
    if (userResponse.ok) {
      const userData = await userResponse.json();
      userId = userData.id;
      console.log(userData);
    } else {
      const errorData = await userResponse.json();
      throw new Error(errorData.message || 'Failed to register user.');
    }

    const formattedDate = formatBookingDate(newReservation.booking_date);
    const formattedTime = formatBookingTime(newReservation.booking_time);

    const reservationResponse = await fetch('http://localhost:5555/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: Number(userId),
        table_id: Number(newReservation.table_id),
        booking_date: formattedDate,
        booking_time: formattedTime,
        no_of_people: Number(newReservation.no_of_people) || 1,
        status: 'confirmed' // Default status
      })
    });

      if (reservationResponse.ok) {
        const addedReservation = await reservationResponse.json();

        // Reset form
        setNewReservation({
          customerName: '',
          customerEmail: '',
          table_id: 1,
          booking_date: '',
          booking_time: '',
          no_of_people: 2
        });

        setShowAddForm(false);

        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Reservation created successfully!',
          timer: 2000,
          showConfirmButton: false
        });

        const [reservationsRes, tablesRes] = await Promise.all([
          fetch('http://localhost:5555/reservations'),
          fetch('http://localhost:5555/tables')
        ]);

        if (reservationsRes.ok && tablesRes.ok) {
          let reservationsData = await reservationsRes.json();
          const tablesData = await tablesRes.json();
          if (selectedOutlet) {
            reservationsData = reservationsData.filter((reservation: any) => reservation.table?.outlet_id === parseInt(selectedOutlet));
          }
          setReservations(reservationsData);
          setTables(tablesData);
        }
      } else {
        const errorData = await reservationResponse.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorData.error || 'Failed to create reservation. Please try again.'
        });
      }

  } catch (error) {
    console.error('Failed to add reservation:', error);
    Swal.fire({
      icon: 'error',
      title: 'Network Error',
      text: 'Please check your connection and try again.'
    });
  } finally {
    setSubmitting(false);
  }
};


  const handleDeleteReservation = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This reservation will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5555/reservations/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setReservations(reservations.filter(reservation => reservation.id !== id));

          await Swal.fire({
            title: 'Deleted!',
            text: 'Reservation has been deleted.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });

          const tablesRes = await fetch('http://localhost:5555/tables');
          if (tablesRes.ok) {
            const tablesData = await tablesRes.json();
            setTables(tablesData);
          }
        } else {
          Swal.fire('Error', 'Failed to delete reservation. Please try again.', 'error');
        }
      } catch (error) {
        console.error('Failed to delete reservation:', error);
        Swal.fire('Network Error', 'Please check your connection and try again.', 'error');
      }
    }
  };


  const handleCancelForm = () => {
    setShowAddForm(false);
    setErrors({});
    setNewReservation({
      customerName: '',
      customerEmail: '',
      table_id: 1,
      booking_date: '',
      booking_time: '',
      no_of_people: 2
    });
  };

  if (!isOwner) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Access Denied</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          You need to be logged in as an owner to access this page
        </p>
      </div>
    );
  }

  if (!selectedOutlet) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300">Please select an outlet to view reservations.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const availableTables = tables.filter(table => 
    table.status === 'available' || table.is_available === 'Yes'
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2 sm:mb-4">
              Reservation Management
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Manage table reservations for customers
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 justify-center"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">Reserve Table</span>
          </button>
        </div>


        {/* General Error Message */}
        {errors.general && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200">{errors.general}</span>
          </div>
        )}

        {/* Add New Reservation Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Reserve Table for Customer</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={newReservation.customerName}
                  onChange={(e) => setNewReservation({ ...newReservation, customerName: e.target.value })}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.customerName && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.customerName}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Customer Email"
                  value={newReservation.customerEmail}
                  onChange={(e) => setNewReservation({ ...newReservation, customerEmail: e.target.value })}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base ${
                    errors.customerEmail ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.customerEmail && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.customerEmail}</p>
                )}
              </div>

              <div>
                <select
                  value={newReservation.table_id}
                  onChange={(e) => setNewReservation({ ...newReservation, table_id: Number(e.target.value) })}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base ${
                    errors.table_id ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select Table</option>
                  {availableTables.map(table => (
                    <option key={table.id} value={table.id}>
                      Table {table.table_number} (Capacity: {table.capacity})
                    </option>
                  ))}
                </select>
                {errors.table_id && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.table_id}</p>
                )}
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Number of People"
                  min="1"
                  max="12"
                  value={newReservation.no_of_people}
                  onChange={(e) => setNewReservation({ ...newReservation, no_of_people: Number(e.target.value) })}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base ${
                    errors.no_of_people ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.no_of_people && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.no_of_people}</p>
                )}
              </div>

              <div>
                <input
                  type="date"
                  value={newReservation.booking_date}
                  onChange={(e) => setNewReservation({ ...newReservation, booking_date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base ${
                    errors.booking_date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.booking_date && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.booking_date}</p>
                )}
              </div>

              <div>
                <select
                  value={newReservation.booking_time}
                  onChange={(e) => setNewReservation({ ...newReservation, booking_time: e.target.value })}
                  className={`w-full px-3 py-2 sm:px-4 sm:py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base ${
                    errors.booking_time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <option value="">Select Time</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                  <option value="17:00">5:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="21:00">9:00 PM</option>
                  <option value="22:00">10:00 PM</option>
                </select>
                {errors.booking_time && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.booking_time}</p>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
              <button
                onClick={handleAddReservation}
                disabled={submitting}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  'Create Reservation'
                )}
              </button>
              <button
                onClick={handleCancelForm}
                disabled={submitting}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Reservations List */}
        <div className="grid gap-6">
          {reservations.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Reservations Found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                No reservations have been made yet.
              </p>
            </div>
          ) : (
            reservations.map((reservation) => (
              <div key={reservation.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      Reservation #{reservation.id}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{reservation.user?.name || 'Unknown Customer'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{reservation.booking_date || 'Date not set'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{reservation.booking_time || 'Time not set'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>
                          Table {reservation.table?.table_number || 'Unknown'} - {reservation.no_of_people || 0} guests
                        </span>
                      </div>
                    </div>
                    {reservation.user?.email && (
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Email: {reservation.user.email}
                      </div>
                    )}
                    <div className="mt-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        reservation.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : reservation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      }`}>
                        {reservation.status || 'Unknown Status'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteReservation(reservation.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete Reservation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
