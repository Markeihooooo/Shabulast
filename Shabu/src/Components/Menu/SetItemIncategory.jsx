import React, { useState, useEffect } from 'react';
import axios from 'axios';

const itemsInCategory = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [items, setItems] = useState([]);

    // Fetch categories from API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/get?page=1'); // Adjust API endpoint
                setCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Fetch items for selected category
    useEffect(() => {
        if (selectedCategory) {
            const fetchItems = async () => {
                try {
                    const response = await axios.get(`/api/get/${selectedCategory}`);
                    setItems(response.data);
                } catch (error) {
                    console.error('Error fetching items:', error);
                }
            };

            fetchItems();
        }
    }, [selectedCategory]);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
                Category Viewer
            </h1>

            {/* Category Buttons */}
            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                    Categories
                </h2>
                <div className="flex flex-wrap gap-4">
                    {categories.map(category => (
                        <button
                            key={category.category_id}
                            onClick={() => setSelectedCategory(category.category_id)}
                            className={`px-4 py-2 rounded-lg ${
                                selectedCategory === category.category_id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            {category.category_name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Items List */}
            {selectedCategory && (
                <div className="mt-6">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        Items in Selected Category
                    </h2>
                    {items.length === 0 ? (
                        <p className="text-gray-500">No items found for this category.</p>
                    ) : (
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {items.map(item => (
                                <li
                                    key={item.category_item_id}
                                    className="p-4 bg-white rounded-lg shadow hover:shadow-lg"
                                >
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {item.category_item_name}
                                    </h3>
                                    <p className="text-gray-600">
                                        Balance: {item.category_item_balance}
                                    </p>
                                    {item.image_url && (
                                        <img
                                            src={item.image_url}
                                            alt={item.category_item_name}
                                            className="mt-2 rounded"
                                        />
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default itemsInCategory;
