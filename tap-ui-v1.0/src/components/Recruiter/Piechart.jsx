import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
 
const COLORS = ['#4CAF50', '#FF9800', '#F44336', '#2196F3', '#9C27B0'];
 
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
 
    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
 
const id=sessionStorage.getItem("employeeId");
 
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            }}>
                <p style={{ margin: '0' }}>{`${payload[0].name}: ${payload[0].value}`}</p>
            </div>
        );
    }
 
    return null;
};
 
function Piechart() {
 
    const [offerData, setOfferData] = useState({
        accepted: 0,
        rejected: 0,
        pending: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
    useEffect(() => {
       
 
      const fetchOffers = async () => {
        try {
            console.log(`Fetching offers for employee ID: ${id}`);
            const response = await axios.get(`http://localhost:8080/tap/api/recruiteroffer/${id}`);
            const offers = response.data;
            console.log('Fetched offers:', offers);
   
            const counts = {
                accepted: offers.filter(offer => offer.candidateStatus === "Accepted").length,
                rejected: offers.filter(offer => offer.candidateStatus === "Rejected").length,
                pending: offers.filter(offer => offer.candidateStatus === "Pending").length,
            };
   
            setOfferData(counts);
        } catch (err) {
            setError(`Error fetching offers: ${err.response?.data?.message || err.message}`);
            console.error('Fetch error:', err);
        }
    };
 
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([ fetchOffers()]);
            setLoading(false);
        };
 
        fetchData();
    }, []);
 
    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;
 
 
 
    const pieData2 = [
        { name: 'Accepted', value: offerData.accepted },
        { name: 'Rejected', value: offerData.rejected },
        { name: 'Pending', value: offerData.pending },
    ];
 
   
 
    return (
        // <div className="flex flex-wrap justify-between w-full">
           
 
            <div className="flex-1 max-w-[28.5rem] h-[22rem] bg-white p-4 m-2  rounded-lg shadow-lg border border-gray-200 flex flex-col">
                <strong className="text-gray-700 font-semibold text-center">CANDIDATE OFFER STATUS</strong>
                <div className="mt-3 w-full flex-1 text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData2}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={120}
                                innerRadius={60}
                                dataKey="value"
                            >
                                {pieData2.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
 
        // </div>
    );
}
 
export default Piechart;
