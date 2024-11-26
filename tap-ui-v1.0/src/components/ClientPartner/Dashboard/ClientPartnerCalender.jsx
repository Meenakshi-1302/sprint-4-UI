import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Toaster, toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addEvent, deleteEvent } from '../../../redux/actions/ClientPartner/Event/EventActions';
 
const ClientPartnerCalendar = () => {
  const [eventName, setEventName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showEndedAlert, setShowEndedAlert] = useState(false);                                                  
  const dispatch = useDispatch();
  const calendarEvents = useSelector((state) => state.events);
 
  // Load events from localStorage when the component mounts
  useEffect(() => {
    const savedEvents = localStorage.getItem("calendarEvents");
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents);
      Object.entries(parsedEvents).forEach(([date, events]) => {
        events.forEach((event) => {
          // Only add the event if it doesn't already exist
          if (!calendarEvents[date]?.some(e => e.id === event.id)) {
            dispatch(addEvent(date, event));
            // Show alert if an event is scheduled for today
            if (new Date(date).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
              setShowAlert(true);
            }
          }
        });
      });
    }
  }, [dispatch]);
 
  // Check for ended events logic
  useEffect(() => {
    const handleEndedEvents = () => {
      const endTime = new Date();
      const todayKey = `${endTime.getFullYear()}-${endTime.getMonth() + 1}-${endTime.getDate()}`;
      if (calendarEvents[todayKey] && calendarEvents[todayKey].length > 0) {
        setShowEndedAlert(true);
      }
    };
 
    const checkEndedEvents = () => {
      const currentHour = new Date().getHours();
      if (currentHour === 0) {
        handleEndedEvents();
      }
    };
 
    const interval = setInterval(checkEndedEvents, 3600000); // Check every hour
    checkEndedEvents();
 
    return () => clearInterval(interval); // Cleanup on unmount
  }, [calendarEvents]);
 
  useEffect(() => {
    localStorage.setItem("calendarEvents", JSON.stringify(calendarEvents));
  }, [calendarEvents]);
 
  const isPastDate = (date) => {
    const today = new Date();
    return new Date(date).setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);
  };
 
  const handleAddEvent = () => {
    if (!selectedDate || isPastDate(selectedDate)) {
      toast.error('Cannot create an event for a past date.');
      return;
    }
 
    if (eventName.trim()) {
      const event = { name: eventName, id: Date.now().toString() };
     
      // Check if the event already exists on the selected date
      if (!calendarEvents[selectedDate]?.some(e => e.name === eventName)) {
        dispatch(addEvent(selectedDate, event));
        setEventName('');
        setSelectedDate('');
       
        // Show alert if an event is created for today
        if (new Date(selectedDate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)) {
          setShowAlert(true);
        }
      } else {
        toast.error('Event already exists for this date.');
      }
    }
  };
 
  const handleConfirmDelete = () => {
    const { id, dateId } = eventToDelete;
    dispatch(deleteEvent(dateId, id));
    toast.success('Event deleted successfully!');
    setIsModalOpen(false);
    setEventToDelete(null);
  };
 
  const openDeleteModal = (id, dateId) => {
    setEventToDelete({ id, dateId });
    setIsModalOpen(true);
  };
 
  const handleDragEnd = (result) => {
    if (!result.destination) return;
 
    const draggedEvent = calendarEvents[result.source.droppableId].find(e => e.id === result.draggableId);
    const newEvents = { ...calendarEvents };
 
    newEvents[result.source.droppableId] = newEvents[result.source.droppableId].filter(e => e.id !== result.draggableId);
 
    if (!newEvents[result.destination.droppableId]) {
      newEvents[result.destination.droppableId] = [];
    }
 
    newEvents[result.destination.droppableId].splice(result.destination.index, 0, draggedEvent);
    console.log("Drag and drop not implemented in Redux action yet", draggedEvent);
  };
 
  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };
 
  const renderCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
 
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const calendarDays = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
 
    weekdays.forEach((day) => {
      calendarDays.push(<div key={day} className="font-bold text-center">{day}</div>);
    });
 
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="border p-2"></div>);
    }
 
    const today = new Date().setHours(0, 0, 0, 0); // Get today's date at midnight for comparison.
 
    for (let i = 1; i <= daysInMonth; i++) {
      const dateId = `${year}-${month + 1}-${i}`;
      const currentDateCheck = new Date(year, month, i).setHours(0, 0, 0, 0); // Check if it is today.
 
      calendarDays.push(
        <Droppable key={dateId} droppableId={dateId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`border p-2 ${currentDateCheck === today ? 'bg-[#7D7B9D]' : 'bg-white'} h-24 relative`} // Add background color for today.
            >
              <span className="font-bold">{i}</span>
              {calendarEvents[dateId] && calendarEvents[dateId].map((event, idx) => (
                <Draggable key={event.id} draggableId={event.id} index={idx}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-blue-300 text-black p-1 rounded mt-1 shadow-md"
                    >
                      {event.name}
                      <button onClick={() => openDeleteModal(event.id, dateId)} className="text-red-500 ml-2">
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      );
    }
 
    return (
      <div>
        <h2 className="text-center font-bold text-xl">{monthNames[month]} {year}</h2>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays}
        </div>
      </div>
    );
  };
 
  const Modal = () => {
    return (
      <div className={`fixed inset-0 flex items-center justify-center z-50 ${isModalOpen ? 'block' : 'hidden'} bg-black bg-opacity-50`}>
        <div className="bg-white rounded p-4 w-1/3 shadow-md">
          <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
          <p>Are you sure you want to delete this event?</p>
          <div className="flex justify-end mt-4">
            <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 px-4 py-2 rounded mr-2">Cancel</button>
            <button onClick={handleConfirmDelete} className="bg-[#27235C] text-white px-4 py-2 rounded">Delete</button>
          </div>
        </div>
      </div>
    );
  };
 
  const Alert = () => {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 flex justify-between items-center">
        <div>
          <strong>Alert:</strong> You have events scheduled for today!
        </div>
        <button onClick={() => setShowAlert(false)} className="text-yellow-500 hover:text-yellow-700">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    );
  };
 
  const EndedAlert = () => {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 flex justify-between items-center">
        <div>
          <strong>Alert:</strong> You had events scheduled today. They have ended.
        </div>
        <button onClick={() => setShowEndedAlert(false)} className="text-red-500 hover:text-red-700">
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    );
  };
 
  return (
    <div className="flex space-x-4 p-4">
      <Toaster />
      <div className="bg-white p-4 rounded shadow-md w-1/2">
        {showAlert && <Alert />} {/* Show today's events alert */}
        {showEndedAlert && <EndedAlert />} {/* Show ended events alert */}
        <div className="flex justify-between mb-4">
          <button onClick={() => changeMonth('prev')} className="bg-[#27235C] text-white px-4 py-2 rounded">&lt;&lt;</button>
          <h3 className="text-lg font-semibold">Monthly Calendar</h3>
          <button onClick={() => changeMonth('next')} className="bg-[#27235C] text-white px-4 py-2 rounded">&gt;&gt;</button>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          {renderCalendar()}
        </DragDropContext>
      </div>
 
      <div className="bg-white p-4 rounded shadow-md w-1/2">
        <h3 className="text-lg font-semibold">Add Event</h3>
        <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-2 p-2 w-full rounded border border-gray-300"
        />
       
        <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="Add new event"
            className="mt-2 p-2 w-full rounded border border-gray-300"
        />
        <button
            onClick={handleAddEvent}
            className="mt-2 bg-[#27235C] text-white p-2 rounded"
        >
            Create Event
        </button>
 
        <h4 className="mt-4">Current Events:</h4>
        <ul className="mt-2">
          {Object.entries(calendarEvents).flatMap(([date, events]) =>
            events.map(event => (
              <li key={event.id} className="flex justify-between items-center">
                <span>{event.name} (Date: {date})</span>
                <button onClick={() => openDeleteModal(event.id, date)} className="text-red-500">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
 
      <Modal /> {/* Render the modal here */}
    </div>
  );
};
 
export default ClientPartnerCalendar;