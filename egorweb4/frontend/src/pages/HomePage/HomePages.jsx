import React, { useEffect, useState } from 'react';
import MyPlot from "../../components/plot/MyPlot";
import '../../styles/homepage.css';
import '../../styles/table.css';
import MyForm from "../../components/Form/MyForm";
import api from '../../PostProcessor';
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";

const HomePages = ({ onLogout }) => {
    const [lastR, setLastR] = useState(1);
    let [results, setResults] = useState([]);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("authToken");
            await fetch('http://localhost:8080/api/auth/logout', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            localStorage.removeItem("authToken");
            navigate("/login");
            onLogout();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const points = await api.fetchPoints();

                const mappedPoints = points.map(res => ({
                    x: res.coordinate.x,
                    y: res.coordinate.y,
                    r: res.coordinate.r,
                    isHit: res.hit,
                    createDateTime: formatDateTime(res.createDateTime),
                    processDateTime: res.processDateTime.toFixed(5),
                }));
                setResults(mappedPoints);
                localStorage.setItem('results', JSON.stringify(mappedPoints));
            } catch (error) {
                console.error("Failed to fetch points", error);
            }
        };

        fetchPoints();
    }, []);

    const convertZonedDateTime = (serverDateTime) => {
        if (!serverDateTime) return "Неверная дата";

        try {
            const [datePart, zonePart] = serverDateTime.split("[");
            const serverZone = zonePart ? zonePart.replace("]", "") : "UTC";

            const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            return DateTime.fromISO(datePart, { zone: serverZone })
                .setZone(userZone)
                .toFormat("yyyy-MM-dd HH:mm:ss");
        } catch (error) {
            console.error("Ошибка при конвертации даты:", error);
            return "Ошибка даты";
        }
    };

    const handleClickPlot = async (coordinate) => {
        try {
            const point = await api.sendPoint(coordinate);
            const newResult = {
                x: coordinate.x,
                y: coordinate.y,
                r: coordinate.radius,
                isHit: point.hit,
                createDateTime: convertZonedDateTime(point.createDateTime),
                processDateTime: point.processDateTime.toFixed(5),
            };
            setResults(prevResults => [...prevResults, newResult]);
            localStorage.setItem('results', JSON.stringify([...results, newResult]));
        } catch (error) {
            console.error("Failed to send point", error);
        }
    };

    const onClick = async () => {
        try {
            await api.deletePoints();
            setResults([]);
            localStorage.removeItem('results');
        } catch (error) {
            console.error("Failed to delete points", error);
        }
    };

    const onSubmit = async (coordinate) => {
        try {
            const point = await api.sendPoint(coordinate);
            const newResult = {
                x: coordinate.x,
                y: coordinate.y,
                r: coordinate.radius,
                isHit: point.hit,
                createDateTime: convertZonedDateTime(point.createDateTime),
                processDateTime: point.processDateTime.toFixed(5),
            };
            setResults(prevResults => [...prevResults, newResult]);
            localStorage.setItem('results', JSON.stringify([...results, newResult]));
        } catch (error) {
            console.error("Failed to send point", error);
        }
    };

    const changeR = (r) => {
        setLastR(r);
    };

    const formatDateTime = (utcDateTime) => {
        const date = new Date(utcDateTime);
        return date.toLocaleString(undefined, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
    };


    return (
        <div className="trash">
            <header className="header">
                <h2>Главная страница</h2>
                <p> Кондилеев Егор Юрьевич | 408840 | P3210</p>
            </header>
            <main className="main">
                <div className="inputAndPlot">
                    <MyPlot
                        height={500} width={500}
                        minX = {-2} maxX={2}
                        minY={-5} maxY={3}
                        radius={lastR}
                        points={results}
                        onClickChart={handleClickPlot}
                    />
                    <MyForm onSubmit={onSubmit} changeR={changeR} onClick={onClick} handleLogout={handleLogout}/>
                </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th>X</th>
                        <th>Y</th>
                        <th>R</th>
                        <th>Результат</th>
                        <th>Дата</th>
                        <th>Время выполнения</th>
                    </tr>
                    </thead>
                    <tbody>
                    {results.map((result) => {
                        return <tr key={result.id}>
                            <td>{result.x.toString().replace('.', ',')}</td>
                            <td>{result.y.toString().replace('.', ',')}</td>
                            <td>{result.r.toString().replace('.', ',')}</td>
                            <td style={{ color: result.isHit ? "green" : "red" }}>
                                {result.isHit ? "hit" : "miss"}
                            </td>
                            <td>{result.createDateTime}</td>
                            <td>{result.processDateTime}</td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </main>
        </div>
    )
}

export default HomePages;