import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {Users} from 'lucide-react';
import {GiCheckMark, GiHourglass, GiFamilyHouse,GiTakeMyMoney } from "react-icons/gi"; 

const MRFDashboardStatsGrid = () => {
    const [stats, setStats] = useState({
        required: 0,
        hired: 0,
        pending: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [overallAppliedCount, setOverallAppliedCount] = useState(null);

    const mrfId = sessionStorage.getItem("mrfid");

    useEffect(() => {
        const fetchMRFData = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/tap/mrf/getMrf/${mrfId}`);
                const mrfData = response.data;

                const required = mrfData.requiredResourceCount || 0;
                const hired = mrfData.mrfStatus.requirementFilled || 0;
                const pending = required - hired;

                setStats({ required, hired, pending });
            } catch (err) {
                setError('Error fetching MRF data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchCandidates = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/tap/getCandidateByMrfId/${mrfId}`);
                const candidates = response.data;
                setOverallAppliedCount(candidates.length); 
            } catch (err) {
                setError('Error fetching candidates');
                console.error(err);
            }
        };

        fetchMRFData();
        fetchCandidates();
    }, [mrfId]);

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

    // StatCard component for consistent styling
    const StatCard = ({ icon: Icon, title, value, color }) => {  
        return (
            <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="text-gray-600 text-sm">{title}</p>
                    <h3 className="text-2xl font-bold">{value}</h3>
                </div>
            </div>
        );
    };

    return (
        <div className='w-full mt-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
                <StatCard
                    icon={Users}
                    title="Required Employees"
                    value={stats.required}
                    color="bg-purple-500"
                />
                <StatCard
                    icon={GiCheckMark}
                    title="Hired Employees"
                    value={stats.hired}
                    color="bg-green-500"
                />
                <StatCard
                    icon={GiHourglass}
                    title="Pending Employees"
                    value={stats.pending}
                    color="bg-orange-500"
                />
                <StatCard
                    icon={GiTakeMyMoney} // Changed icon here
                    title="Overall Applied Count"
                    value={overallAppliedCount}
                    color="bg-blue-500"
                />
            </div>
        </div>
    );
};

export default MRFDashboardStatsGrid;