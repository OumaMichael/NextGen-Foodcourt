'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import { useAuth } from '@/contexts/AuthContext';
import { fetchTables, fetchReservations, createReservation, deleteReservation } from '@/lib/api';

interface Table {
  id: number;
  table_number: number;
  capacity: number;
  is_available: string;
}

interface Reservation {
  id: number;
  user_id: number;
  table_id: number;
  booking_date: string;
  booking_time: string;
  no_of_people: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
}

interface FormData {
  customerName: string;
  selectedTable: string;
  date: string;
  time: string;
  guestCount: number;
  includeOrder: boolean;
}

export default function Reservations() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showReservations, setShowReservations] = useState(false);
  const [reservedTables, setReservedTables] = useState<number[]>([]);

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    selectedTable: '',
    date: '',
    time: '',
    guestCount: 1,
    includeOrder: false
  });
  const [orderId, setOrderId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlOrderId = searchParams.get('orderId');
    if (urlOrderId) {
      setOrderId(urlOrderId);
    }

    if (!isLoggedIn) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to make reservations',
        icon: 'warning',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#f97316',
      }).then(() => {
        router.push('/login');
      });
      return;
    }

    if (isLoggedIn && user) {
      setFormData(prev => ({ 
        ...prev, 
        customerName: user.name || user.email 
      }));
      
      fetchData();
    }
  }, [isLoggedIn, user, router]);


  const fetchData = async () => {
    try {
      setLoading(true);
      
      const tablesData = await fetchTables();
      setTables(tablesData);

      const reservationsData = await fetchReservations();
      
      const userReservations = reservationsData.filter((res: Reservation) => {
          if (!user?.id) return false;
          return res.user_id === Number(user.id) && res.status !== 'cancelled';
      });
      
      setReservations(userReservations);
      
      const reservedTableIds = userReservations.map((res: Reservation) => res.table_id);
      setReservedTables(reservedTableIds);
      
    } catch (error) {
      console.error("Failed to fetch data:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch data'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className="w-12 h-12 border-4 border-yellow-500 border-solid rounded-full border-t-transparent animate-spin"></div>
        <p className="text-yellow-600 text-lg">Loading...</p>
      </div>
    );
  }

  const availableTables = tables.filter(table => 
     table.is_available === 'Yes' && !reservedTables.includes(table.id)
  );

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    let processedValue = value;
    
    if (field === 'guestCount') {
      const numValue = typeof value === 'string' ? parseInt(value) : value;
      processedValue = isNaN(numValue as number) ? 1 : numValue;
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }));
  };

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to make a reservation',
        icon: 'warning',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#f97316',
      }).then(() => {
        router.push('/login');
      });
      return;
    }
    
    if (!formData.selectedTable || !formData.date || !formData.time || !formData.customerName) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields!'
      });
      return;
    }

    if (!user?.id) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'User information not found. Please log in again.'
      });
      router.push('/login');
      return;
    }

    const selectedTableInfo = tables.find(t => t.id.toString() === formData.selectedTable);
    
    const timeWithSeconds = formData.time.includes(':') && formData.time.split(':').length === 2 
      ? `${formData.time}:00` 
      : formData.time;
    
    const reservationData = {
      user_id: parseInt(user.id),
      table_id: parseInt(formData.selectedTable),
      booking_date: formData.date,
      booking_time: timeWithSeconds,
      no_of_people: formData.guestCount,
      status: 'confirmed' as const,
      ...(orderId && { order_id: parseInt(orderId) })
    };

    try {
      const responseData = await createReservation(reservationData);

      setReservations([...reservations, responseData]);
      setReservedTables([...reservedTables, parseInt(formData.selectedTable)]);
      
      Swal.fire({
        icon: 'success',
        title: 'Reservation Confirmed!',
        html: `
          <div style="
            background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
            border-radius: 16px;
            padding: 24px;
            margin: 20px 0;
            border: 2px solid #fb923c;
            box-shadow: 0 8px 25px rgba(251, 146, 60, 0.15);
          ">
            <div style="
              display: grid;
              gap: 16px;
              text-align: left;
            ">
              <div style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 12px;
                border-left: 4px solid #f97316;
              ">
                <div style="
                  width: 32px;
                  height: 32px;
                  background: #f97316;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 14px;
                ">🪑</div>
                <div>
                  <div style="font-size: 14px; color: #9ca3af; font-weight: 500;">Table Number</div>
                  <div style="font-size: 18px; font-weight: 700; color: #1f2937;">${selectedTableInfo?.table_number}</div>
                </div>
              </div>
              
              <div style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 12px;
                border-left: 4px solid #f97316;
              ">
                <div style="
                  width: 32px;
                  height: 32px;
                  background: #f97316;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 14px;
                ">📅</div>
                <div>
                  <div style="font-size: 14px; color: #9ca3af; font-weight: 500;">Date</div>
                  <div style="font-size: 18px; font-weight: 700; color: #1f2937;">${new Date(formData.date).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</div>
                </div>
              </div>
              
              <div style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 12px;
                border-left: 4px solid #f97316;
              ">
                <div style="
                  width: 32px;
                  height: 32px;
                  background: #f97316;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 14px;
                ">🕐</div>
                <div>
                  <div style="font-size: 14px; color: #9ca3af; font-weight: 500;">Time</div>
                  <div style="font-size: 18px; font-weight: 700; color: #1f2937;">${(() => {
                    const [hours, minutes] = formData.time.split(':');
                    const hour24 = parseInt(hours);
                    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                    const ampm = hour24 >= 12 ? 'PM' : 'AM';
                    return `${hour12}:${minutes} ${ampm}`;
                  })()}</div>
                </div>
              </div>
              
              <div style="
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 12px;
                border-left: 4px solid #f97316;
              ">
                <div style="
                  width: 32px;
                  height: 32px;
                  background: #f97316;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-weight: bold;
                  font-size: 14px;
                ">👥</div>
                <div>
                  <div style="font-size: 14px; color: #9ca3af; font-weight: 500;">Number of Guests</div>
                  <div style="font-size: 18px; font-weight: 700; color: #1f2937;">${formData.guestCount} ${formData.guestCount === 1 ? 'Guest' : 'Guests'}</div>
                </div>
              </div>
            </div>
            
            <div style="
              margin-top: 20px;
              padding: 16px;
              background: rgba(34, 197, 94, 0.1);
              border-radius: 12px;
              border: 1px solid rgba(34, 197, 94, 0.3);
              text-align: center;
            ">
              <div style="
                font-size: 16px;
                font-weight: 600;
                color: #059669;
                margin-bottom: 4px;
              ">🎉 Your table is reserved!</div>
              <div style="
                font-size: 14px;
                color: #065f46;
              ">Please arrive on time to secure your table</div>
            </div>
          </div>
        `,
        confirmButtonColor: '#f97316',
        confirmButtonText: '✨ Awesome!',
        customClass: {
          popup: 'swal-custom-popup',
          title: 'swal-custom-title',
          confirmButton: 'swal-custom-button'
        },
        buttonsStyling: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showClass: {
          popup: 'animate__animated animate__fadeInUp animate__faster'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutDown animate__faster'
        }
      }).then(() => {
        router.push('/reservations');
      });
      
      setFormData({
        customerName: user?.name || user?.email || '',
        selectedTable: '',
        date: '',
        time: '',
        guestCount: 1,
        includeOrder: false
      });
      
    } catch (error) {
      console.error('Failed to create reservation:', error);
      Swal.fire({
        icon: 'error',
        title: 'Reservation Failed',
        text: error instanceof Error ? error.message : 'There was an error creating your reservation. Please try again.',
        confirmButtonColor: '#f97316'
      });
    }
  };

  const cancelReservation = async (reservationId: number) => {
    const reservation = reservations.find(res => res.id === reservationId);
    if (!reservation) return;

    const result = await Swal.fire({
      title: 'Cancel Reservation?',
      text: 'Are you sure you want to cancel this reservation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: 'Yes, cancel it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteReservation(reservationId.toString());

        setReservations(reservations.map(res => 
          res.id === reservationId 
            ? { ...res, status: 'cancelled' as const }
            : res
        ));
        
        setReservedTables(reservedTables.filter(tableId => tableId !== reservation.table_id));

        Swal.fire({
          icon: 'success',
          title: 'Cancelled!',
          text: 'Your reservation has been cancelled. The table is now available for other customers.',
          confirmButtonColor: '#f97316'
        }).then(() => {
        router.push('/');
      });
      } catch (error) {
        console.error('Failed to cancel reservation:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error instanceof Error ? error.message : 'Failed to cancel reservation. Please try again.',
          confirmButtonColor: '#f97316'
        });
      }
    }
  };

  const getTableNumber = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    return table?.table_number || 'Unknown';
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div>
      
      <div className="mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
          Table Reservations
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Reserve a shared table in our food court for your dining experience
        </p>
        
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setShowReservations(false)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              !showReservations 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Make Reservation
          </button>
          <button
            onClick={() => setShowReservations(true)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              showReservations 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            My Reservations ({reservations.filter(r => r.status !== 'cancelled').length})
          </button>
        </div>
      </div>

      {!showReservations ? (
        <div className="grid lg:grid-cols-2 gap-8">
        
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Available Tables</h2>
            
            <div className="grid gap-4">
              {tables.map((table) => (
                <div 
                  key={table.id} 
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    table.is_available === 'No' || reservedTables.includes(table.id)
                      ? 'border-red-200 bg-red-50' 
                      : formData.selectedTable === table.id.toString()
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => table.is_available === 'Yes' && !reservedTables.includes(table.id) && handleInputChange('selectedTable', table.id.toString())}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        Table {table.table_number}
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-300">
                        Capacity: {table.capacity} people
                      </p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-lg font-semibold ${
                      table.is_available === 'Yes' && !reservedTables.includes(table.id)
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {table.is_available === 'Yes' && !reservedTables.includes(table.id) ? 'Available' : 'Reserved'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

         <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Make a Reservation</h2>
            
            <form onSubmit={handleReservation} className="space-y-4">
             
              <div>
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Selected Table
                </label>
                <select
                  value={formData.selectedTable}
                  onChange={(e) => handleInputChange('selectedTable', e.target.value)}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Choose a table...</option>
                  {availableTables.map((table) => (
                    <option key={table.id} value={table.id.toString()}>
                      Table {table.table_number} (Capacity: {table.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]} 
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Time *
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="">Select time...</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="12:30">12:30 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="13:30">1:30 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="14:30">2:30 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="15:30">3:30 PM</option>
                    <option value="16:00">4:00 PM</option>
                    <option value="16:30">4:30 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="17:30">5:30 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Number of Guests
                </label>
                <input
                  type="number"
                  value={formData.guestCount || 1}
                  onChange={(e) => handleInputChange('guestCount', e.target.value ? parseInt(e.target.value) : 1)}
                  min="1"
                  max="8"
                  className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl text-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Reserve Table
              </button>
            </form>
          </div>
        </div>
      ) : (
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">My Reservations</h2>
          
          {reservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 dark:text-gray-400">No reservations found</p>
              <button
                onClick={() => setShowReservations(false)}
                className="mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
              >
                Make Your First Reservation
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {reservations.filter(r => r.status !== 'cancelled').map((reservation) => (
                <div 
                  key={reservation.id} 
                  className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                    reservation.status === 'confirmed' 
                      ? 'border-orange-200 bg-orange-50 dark:bg-orange-900/20' 
                      : reservation.status === 'cancelled'
                      ? 'border-red-200 bg-red-50 dark:bg-red-900/20'
                      : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Table {getTableNumber(reservation.table_id)}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 text-lg">
                        <div>
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Customer:</span> {user?.name || user?.email}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Date:</span> {formatDate(reservation.booking_date)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Time:</span> {formatTime(reservation.booking_time)}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Guests:</span> {reservation.no_of_people}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-4 py-2 rounded-full text-lg font-semibold ${
                        reservation.status === 'confirmed' 
                          ? 'bg-orange-100 text-orange-800' 
                          : reservation.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                      
                      {reservation.status === 'confirmed' && (
                        <button
                          onClick={() => cancelReservation(reservation.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}