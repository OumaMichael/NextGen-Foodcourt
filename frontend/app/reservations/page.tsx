'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Table {
  id: number;
  table_number: number;
  capacity: number;
  is_available: string;
}

interface Reservation {
  id: number;
  table_id: number;
  user_id: number;
  customerName: string;
  booking_date: string;
  booking_time: string;
  no_of_people: number;
  status: string;
  table?: {
    table_number: number;
    capacity: number;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Reservations() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [reservationDate, setReservationDate] = useState('');
  const [reservationTime, setReservationTime] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showReservations, setShowReservations] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user');
        
        if (!token || !storedUser) {
          router.push('/login');
          return;
        }

        const response = await fetch('http://localhost:5555/check-auth', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch tables and reservations
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [tablesRes, reservationsRes] = await Promise.all([
          fetch('http://localhost:5555/tables', { headers }),
          fetch('http://localhost:5555/reservations', { headers })
        ]);

        if (tablesRes.ok && reservationsRes.ok) {
          const tablesData = await tablesRes.json();
          const reservationsData = await reservationsRes.json();
          
          setTables(tablesData);
          setReservations(reservationsData.filter((res: Reservation) => res.user_id === user.id));
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error('Failed to fetch data');
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const availableTables = tables.filter(table => table.is_available === 'Yes');

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTable || !reservationDate || !reservationTime) {
      toast.error('Please fill in all required fields!');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:5555/reservations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user?.id,
          table_id: parseInt(selectedTable),
          booking_date: reservationDate,
          booking_time: reservationTime,
          no_of_people: guestCount,
          status: 'confirmed'
        })
      });

      if (response.ok) {
        const newReservation = await response.json();
        setReservations([...reservations, newReservation]);
        
        const selectedTableInfo = tables.find(t => t.id === parseInt(selectedTable));
        toast.success(`Table ${selectedTableInfo?.table_number} reserved successfully!`);
        
        // Reset form
        setSelectedTable('');
        setReservationDate('');
        setReservationTime('');
        setGuestCount(1);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create reservation');
      }
    } catch (error) {
      console.error('Reservation error:', error);
      toast.error('Failed to create reservation');
    }
  };

  const cancelReservation = async (reservationId: number) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:5555/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setReservations(reservations.filter(res => res.id !== reservationId));
        toast.success('Reservation cancelled successfully');
      } else {
        toast.error('Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Cancel reservation error:', error);
      toast.error('Failed to cancel reservation');
    }
  };

  const getTableNumber = (tableId: number) => {
    const table = tables.find(t => t.id === tableId);
    return table?.table_number || 'Unknown';
  };

  return (
    <>
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
                    table.is_available === 'No'
                      ? 'border-red-200 bg-red-50' 
                      : selectedTable === table.id.toString()
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => table.is_available === 'Yes' && setSelectedTable(table.id.toString())}
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
                      table.is_available === 'Yes'
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {table.is_available === 'Yes' ? 'Available' : 'Reserved'}
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
                  Selected Table
                </label>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
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
                    value={reservationDate}
                    onChange={(e) => setReservationDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]} // Minimum date is today
                    className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Time *
                  </label>
                  <select
                    value={reservationTime}
                    onChange={(e) => setReservationTime(e.target.value)}
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
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value))}
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
              {reservations.map((reservation) => (
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
                            <span className="font-semibold">Customer:</span> {user?.name}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Date:</span> {reservation.booking_date}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Time:</span> {reservation.booking_time}
                          </p>
                          <p className="text-gray-600 dark:text-gray-300">
                            <span className="font-semibold">Guests:</span> {reservation.no_of_people}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-4 py-2 rounded-full text-lg font-semibold ${
                        reservation.status === 'Confirmed' 
                          ? 'bg-orange-100 text-orange-800' 
                          : reservation.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </span>
                      
                      {reservation.status === 'Confirmed' && (
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
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}