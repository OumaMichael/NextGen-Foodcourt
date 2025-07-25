'use client';

import { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Plus, Edit, Trash2 } from 'lucide-react';

interface Reservation {
  id: number;
  user_id: number;
  table_id: number;
  reservation_date: string;
  reservation_time: string;
  status: string;
  party_size: number;
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
}

export default function ReservationManagement() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newReservation, setNewReservation] = useState({
    customerName: '',
    customerEmail: '',
    table_id: 1,
    reservation_date: '',
    reservation_time: '',
    party_size: 2
  });

  const isOwner = typeof window !== 'undefined' && localStorage.getItem('userType') === 'admin';

  // ✨ HIGHLIGHTED useEffect - Fetches reservation data from backend
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
        // Set mock data on error
        setReservations([]);
        setTables([
          { id: 1, table_number: 1, capacity: 4, status: 'available' },
          { id: 2, table_number: 2, capacity: 6, status: 'available' },
          { id: 3, table_number: 3, capacity: 4, status: 'reserved' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (isOwner) {
      fetchReservationData();
    }
  }, [isOwner]);

  const handleAddReservation = async () => {
    try {
      // First create a user (simplified for demo)
      const userResponse = await fetch('http://localhost:5555/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newReservation.customerName,
          email: newReservation.customerEmail,
          password: 'temppass123',
          phone_no: '0700000000',
          role: 'customer'
        })
      });

      let userId = 1; // Default fallback
      if (userResponse.ok) {
        const userData = await userResponse.json();
        userId = userData.id;
      }

      // Then create the reservation
      const reservationResponse = await fetch('http://localhost:5555/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          table_id: newReservation.table_id,
          reservation_date: newReservation.reservation_date,
          reservation_time: newReservation.reservation_time,
          party_size: newReservation.party_size,
          status: 'confirmed'
        })
      });

      if (reservationResponse.ok) {
        const addedReservation = await reservationResponse.json();
        setReservations([...reservations, addedReservation]);
        setNewReservation({
          customerName: '',
          customerEmail: '',
          table_id: 1,
          reservation_date: '',
          reservation_time: '',
          party_size: 2
        });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Failed to add reservation:', error);
    }
  };

  const handleDeleteReservation = async (id: number) => {
    if (confirm('Are you sure you want to delete this reservation?')) {
      try {
        const response = await fetch(`http://localhost:5555/reservations/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setReservations(reservations.filter(reservation => reservation.id !== id));
        }
      } catch (error) {
        console.error('Failed to delete reservation:', error);
      }
    }
  };

  if (!isOwner) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Access Denied</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          You need to be logged in as an admin to access this page
        </p>
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              Reservation Management
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Manage table reservations for customers
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Reserve Table for Customer
          </button>
        </div>

        {/* Add New Reservation Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reserve Table for Customer</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={newReservation.customerName}
                onChange={(e) => setNewReservation({ ...newReservation, customerName: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="email"
                placeholder="Customer Email"
                value={newReservation.customerEmail}
                onChange={(e) => setNewReservation({ ...newReservation, customerEmail: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                value={newReservation.table_id}
                onChange={(e) => setNewReservation({ ...newReservation, table_id: Number(e.target.value) })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {tables.filter(table => table.status === 'available').map(table => (
                  <option key={table.id} value={table.id}>
                    Table {table.table_number} (Capacity: {table.capacity})
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Party Size"
                min="1"
                max="8"
                value={newReservation.party_size}
                onChange={(e) => setNewReservation({ ...newReservation, party_size: Number(e.target.value) })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="date"
                value={newReservation.reservation_date}
                onChange={(e) => setNewReservation({ ...newReservation, reservation_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                value={newReservation.reservation_time}
                onChange={(e) => setNewReservation({ ...newReservation, reservation_time: e.target.value })}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              </select>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleAddReservation}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Create Reservation
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
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
                    <div className="grid md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{reservation.user?.name || 'Unknown Customer'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{reservation.reservation_date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{reservation.reservation_time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Table {reservation.table?.table_number} - {reservation.party_size} guests</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        reservation.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                      }`}>
                        {reservation.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteReservation(reservation.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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