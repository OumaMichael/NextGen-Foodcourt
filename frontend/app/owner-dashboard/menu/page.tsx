'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Swal from 'sweetalert2';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  outlet_id: number;
}

interface Outlet {
  id: number;
  name: string;
}

export default function MenuManagement() {
  const { selectedOutlet } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<number | null>(null);
  const [editingItemData, setEditingItemData] = useState<MenuItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    outlet_id: 1
  });

  const isOwner = typeof window !== 'undefined' && localStorage.getItem('userType') === 'owner';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, outletsRes] = await Promise.all([
          fetch('http://localhost:5555/menu-items'),
          fetch('http://localhost:5555/outlets')
        ]);

        const menuData = await menuRes.json();
        const outletsData = await outletsRes.json();

        // Filter menu items by outlet ID if provided in context
        const filteredMenuData = selectedOutlet 
          ? menuData.filter((item: MenuItem) => item.outlet_id === parseInt(selectedOutlet))
          : menuData;

        setMenuItems(filteredMenuData);
        setOutlets(outletsData);
        
        // Set default outlet_id for new items if outlet ID is provided
        if (selectedOutlet) {
          setNewItem(prev => ({ ...prev, outlet_id: parseInt(selectedOutlet) }));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch menu data. Please try again.'
        });
      } finally {
        setLoading(false);
      }
    };

    if (isOwner) {
      fetchData();
    }
  }, [isOwner, selectedOutlet]);

  useEffect(() => {
    const updateEditingItemData = () => {
      if (editingItem !== null) {
        const itemToEdit = menuItems.find(item => item.id === editingItem);
        if (itemToEdit) {
          setEditingItemData(itemToEdit);
        }
      } else {
        setEditingItemData(null);
      }
    };
    
    updateEditingItemData();
  }, [editingItem, menuItems]);

  const handleAddItem = async () => {
    try {
      const response = await fetch('http://localhost:5555/menu-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });

      if (response.ok) {
        const addedItem = await response.json();
        setMenuItems([...menuItems, addedItem]);
        setNewItem({ name: '', description: '', price: 0, category: '', outlet_id: 1 });
        setShowAddForm(false);
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Menu item added successfully!'
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorData.message || 'Failed to add menu item. Please try again.'
        });
      }
    } catch (error) {
      console.error('Failed to add item:', error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Failed to add menu item. Please check your connection and try again.'
      });
    }
  };

  const handleDeleteItem = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This menu item will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5555/menu-items/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setMenuItems(menuItems.filter(item => item.id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Menu item has been deleted.'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete menu item. Please try again.'
          });
        }
      } catch (error) {
        console.error('Failed to delete item:', error);
        Swal.fire({
          icon: 'error',
          title: 'Network Error',
          text: 'Failed to delete menu item. Please check your connection and try again.'
        });
      }
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItemData) return;

    try {
      const response = await fetch(`http://localhost:5555/menu-items/${editingItemData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItemData)
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setMenuItems(menuItems.map(item => item.id === updatedItem.id ? updatedItem : item));
        setEditingItem(null);
        setEditingItemData(null);
        
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Menu item has been updated.'
        });
      } else {
        const errorData = await response.json();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorData.message || 'Failed to update menu item. Please try again.'
        });
      }
    } catch (error) {
      console.error('Failed to update item:', error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Failed to update menu item. Please check your connection and try again.'
      });
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!editingItemData) return;
    
    const { name, value } = e.target;
    setEditingItemData({
      ...editingItemData,
      [name]: name === 'price' ? Number(value) : value
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2 sm:mb-4">
              Menu Management
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Add, edit, and manage your menu items
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 justify-center"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="whitespace-nowrap">Add New Item</span>
          </button>
        </div>

        {/* Add New Item Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Menu Item</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="Item Name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Category"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                value={newItem.outlet_id}
                onChange={(e) => setNewItem({ ...newItem, outlet_id: Number(e.target.value) })}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {outlets.map(outlet => (
                  <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full mt-3 sm:mt-4 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
            />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
              <button
                onClick={handleAddItem}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Item
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit Item Form */}
        {editingItem !== null && editingItemData && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Menu Item</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                name="name"
                placeholder="Item Name"
                value={editingItemData.name}
                onChange={handleEditInputChange}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={editingItemData.price}
                onChange={handleEditInputChange}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={editingItemData.category}
                onChange={handleEditInputChange}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                name="outlet_id"
                value={editingItemData.outlet_id}
                onChange={handleEditInputChange}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {outlets.map(outlet => (
                  <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                ))}
              </select>
            </div>
            <textarea
              name="description"
              placeholder="Description"
              value={editingItemData.description}
              onChange={handleEditInputChange}
              className="w-full mt-3 sm:mt-4 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
            />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
              <button
                onClick={handleUpdateItem}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Update Item
              </button>
              <button
                onClick={() => setEditingItem(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Menu Items List */}
        <div className="grid gap-4 sm:gap-6">
          {menuItems.map((item) => (
            editingItem === item.id ? null : (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm sm:text-base">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-300 px-2 py-1 rounded text-xs sm:text-sm">
                        {item.category}
                      </span>
                      <span className="font-semibold text-green-600 dark:text-green-400 text-base sm:text-lg">
                        KSh {item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={() => setEditingItem(item.id)}
                      className="p-2 sm:p-3 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit Item"
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 sm:p-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        {menuItems.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400">No menu items found</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="mt-4 bg-orange-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
            >
              Add Your First Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
