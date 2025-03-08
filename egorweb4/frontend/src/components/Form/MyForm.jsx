import React, { useState } from 'react';
import '../../styles/form.css';

const MyForm = ({ onSubmit, changeR, onClick, handleLogout }) => {
    const [xValue, setXValue] = useState(null);
    const [yValue, setYValue] = useState('');
    const [rValue, setRValue] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const setR = (r) => {
        setRValue(r);
        changeR(r);
    };

    const validate = () => {
        const message = {};

        if (xValue === null) {
            message.xValue = 'Выберите значение для X.';
        }

        const yNum = parseFloat(yValue);
        if (isNaN(yNum) || yNum < -5 || yNum > 3) {
            message.yValue = 'Введите Y в диапазоне от -5 до 3.';
        }

        if (rValue === null) {
            message.radius = 'Выберите значение для радиуса.';
        }

        setErrors(message);
        return Object.keys(message).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
            const pointData = {
                x: parseFloat(xValue),
                y: parseFloat(yValue),
                radius: parseFloat(rValue),
            };
            setIsSubmitting(true);
            onSubmit(pointData);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="input">
            <h3>Добавить точку</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Координата X:</label>
                    <div>
                        {['-2', '-1.5', '-1', '-0.5', '0', '0.5', '1', '1.5', '2'].map((value) => (
                            <label key={value}>
                                <input
                                    type="checkbox"
                                    value={value}
                                    checked={xValue === value}
                                    onChange={() => setXValue(xValue === value ? null : value)}
                                />
                                {value}
                            </label>
                        ))}
                    </div>
                    {errors.xValue && <div className="error">{errors.xValue}</div>}
                </div>

                <div>
                    <label>Координата Y (от -5 до 3):</label>
                    <input
                        type="text"
                        value={yValue}
                        onChange={(e) => setYValue(e.target.value)}
                        placeholder="Введите Y"
                    />
                    {errors.yValue && <div className="error">{errors.yValue}</div>}
                </div>

                <div style={{ marginTop: '15px' }}>
                    <label>Радиус:</label>
                    <div>
                        {['-2', '-1.5', '-1', '-0.5', '0', '0.5', '1', '1.5', '2'].map((value) => (
                            <label key={value}>
                                <input
                                    type="checkbox"
                                    value={value}
                                    checked={rValue === value}
                                    onChange={() => setR(rValue === value ? null : value)}
                                />
                                {value}
                            </label>
                        ))}
                    </div>
                    {errors.radius && <div className="error">{errors.radius}</div>}
                </div>
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Отправка...' : 'Отправить'}
                </button>
                <button type="reset" disabled={isSubmitting} onClick={onClick}>
                    Очистить
                </button>
                <button type="button" disabled={isSubmitting} onClick={handleLogout}>
                    Выйти
                </button>
            </form>
        </div>
    );
};

export default MyForm;