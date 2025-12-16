import React, { useState, useEffect, useRef } from 'react';
import { searchAddress } from '../../services/mapService';
import { MapPin } from 'lucide-react';

const AddressAutocomplete = ({ value, onChange, name }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInput = async (e) => {
        const val = e.target.value;
        onChange(e); // Propagate change to parent form

        if (val.length > 2) {
            const results = await searchAddress(val);
            setSuggestions(results);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelect = (address) => {
        // Create a fake event object to maintain compatibility with parent's handleInputChange
        const fakeEvent = {
            target: {
                name: name,
                value: address
            }
        };
        onChange(fakeEvent);
        setShowSuggestions(false);
    };

    return (
        <div className="form-group" ref={wrapperRef} style={{ position: 'relative' }}>
            <label>Địa chỉ nhận hàng (Tìm kiếm Google Maps)</label>
            <div style={{ position: 'relative' }}>
                <input
                    type="text"
                    name={name}
                    className="form-control"
                    value={value}
                    onChange={handleInput}
                    placeholder="Nhập địa chỉ của bạn..."
                    autoComplete="off"
                />
                <MapPin size={18} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    zIndex: 1000,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    maxHeight: '200px',
                    overflowY: 'auto'
                }}>
                    {suggestions.map((addr, idx) => (
                        <div
                            key={idx}
                            onClick={() => handleSelect(addr)}
                            style={{
                                padding: '10px',
                                cursor: 'pointer',
                                borderBottom: idx === suggestions.length - 1 ? 'none' : '1px solid #eee'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                            <MapPin size={14} style={{ marginRight: '8px', display: 'inline', verticalAlign: 'middle', color: '#666' }} />
                            <span style={{ verticalAlign: 'middle', fontSize: '0.9rem' }}>{addr}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressAutocomplete;
