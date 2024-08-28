import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sobers: React.FC = () => {
  const [offeredDate, setOfferedDate] = useState<string | null>(null);
  const [timeDiff, setTimeDiff] = useState<{
    years: number;
    months: number;
    days: number;
    hours: number;
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDate, setNewDate] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchSoberDate = async () => {
      try {
        const response = await axios.get('/api/soberData');
        if (response.status === 200 && response.data.soberDate) {
          setOfferedDate(response.data.soberDate);
        }
      } catch (error) {
        console.error('Error fetching sober date:', error);
      }
    };

    fetchSoberDate();
  }, []);

  useEffect(() => {
    if (!offeredDate) return;

    const calculateDateDifference = () => {
      try {
        const currentDate = new Date();
        const offered = new Date(offeredDate);

        if (isNaN(offered.getTime())) {
          console.error('Invalid date format:', offeredDate);
          return;
        }

        const diffInMilliseconds = currentDate.getTime() - offered.getTime();
        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60)) - 7;
        const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24)) + 1;

        const daysPerMonth = 30.44;
        const adjustedDayForMonths = diffInDays - (diffInDays % daysPerMonth >= daysPerMonth / 2 ? (diffInDays % daysPerMonth) - daysPerMonth : diffInDays % daysPerMonth);
        const adjustedDayForYears = diffInDays - 2;

        const months = parseFloat((adjustedDayForMonths / daysPerMonth).toFixed(2));
        const years = parseFloat((adjustedDayForYears / 365.25).toFixed(2));

        setTimeDiff({
          years,
          months,
          days: diffInDays,
          hours: diffInHours,
        });

        checkMilestones(diffInDays);
      } catch (error) {
        console.error('Error calculating date difference:', error);
      }
    };

    calculateDateDifference();
  }, [offeredDate]);

  const checkMilestones = (days: number) => {
    const milestones = [30, 60, 90, 183];
    
    if (milestones.includes(days)) {
      if (days === 183) {
        setNotification(`🎉 Congratulations! You've reached 6 months of sobriety! 🎉`);
      } else {
        setNotification(`Awesome! You have been sober for ${days} days.`);
      }
      return;
    }

    // Check for yearly milestones
    const yearMilestones = [
      { year: 1, days: 367 },
      { year: 2, days: 732 },
      { year: 3, days: 1097 },
      { year: 4, days: 1462 },
      { year: 5, days: 1828 },
      // Add more yearly milestones as needed up to 50 years
    ];

    for (const milestone of yearMilestones) {
      if (days === milestone.days) {
        setNotification(`🎉 Congratulations! You've been sober for ${milestone.year} year${milestone.year > 1 ? 's' : ''}! 🎉`);
        return;
      }
    }
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = event.target.value;
    setNewDate(selectedDate);
  };

  const handleSaveDate = async () => {
    const currentDate = new Date();
    const selectedDate = new Date(newDate);

    if (selectedDate > currentDate) {
      toast.error('To properly calculate sobriety date, please enter an earlier date.', {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: (
          <button
            onClick={() => toast.dismiss()}
            className="text-white font-bold bg-blue-500 hover:bg-blue-700 rounded px-2 py-1"
            style={{
              fontSize: '12px',
              lineHeight: '1.2',
              padding: '1px 6px',
              height: '20px',
            }}
          >
            OK
          </button>
        ),
        draggable: false,
        className: 'toast-centered',
        bodyClassName: 'toast-body-centered',
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }
      });
      return;
    }

    try {
      const response = await axios.post('/api/soberData', { soberDate: newDate });
      if (response.status === 200) {
        setOfferedDate(newDate);
        toast.success('Sober date updated successfully!');
      }
    } catch (error) {
      console.error('Error updating sober date:', error);
      toast.error('Failed to update sober date.');
    }
    setIsModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const formattedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return formattedDate;
  };

  return (
    <div className="bg-blue-100 rounded-lg shadow-lg p-8 text-center">
      <ToastContainer />
      <div className="flex flex-col items-center mb-2 text-black text-center">
        <span
          className="text-2xl font-bold text-green-600 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
          style={{ fontFamily: 'Lato', letterSpacing: '.5px' }}
        >
          {offeredDate ? formatDate(offeredDate) : 'Enter Sobriety Date!'}
        </span>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-xl font-bold text-black mb-4 text-center">Select Sobriety Date</div>
          
          <div className="flex justify-center mb-4">
            <input
              type="date"
              value={newDate}
              onChange={handleDateChange}
              placeholder="MM/DD/YYYY" // Added placeholder
              className="border rounded-md p-2 text-center text-black focus:outline-none focus:ring-2 focus:ring-blue-400 w-3/4 sm:w-1/2 bg-gradient-to-l from-blue-300 via-blue-100 to-blue-200"
              style={{ fontSize: '18px' }} // Adjusted font size for better visibility
            />
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleSaveDate}
              className="px-4 py-2 bg-green-400 hover:bg-green-500 text-black font-semibold rounded-md shadow w-3/4 sm:w-1/2"
            >
              Save Date
            </button>
          </div>
        </div>
      </Modal>

      {offeredDate && (
        <>
          <div className="flex flex-col items-center mb-2 text-black text-center">
            <span className="text-2xl font-bold">{timeDiff?.years.toFixed(2) || 0}</span> Years
          </div>
          <div className="flex flex-col items-center mb-2 text-black text-center">
            <span className="text-2xl font-bold">{timeDiff?.months.toFixed(2) || 0}</span> Months
          </div>
          <div className="flex flex-col items-center mb-2 text-black text-center">
            <span className="text-2xl font-bold">{timeDiff?.days || 1}</span> Days
          </div>
          <div className="flex flex-col items-center text-black text-center">
            <span className="text-2xl font-bold">{timeDiff?.hours || 0}</span> Hours
          </div>
        </>
      )}

      {notification && (
        <div className="mt-4 text-lg font-bold text-green-600">{notification}</div>
      )}
    </div>
  );
};

export default Sobers;