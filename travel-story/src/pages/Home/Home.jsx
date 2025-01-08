import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddEditTravelStory from "./AddEditTravelStory";
import Modal from "react-modal";
import moment from "moment";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { MdAdd } from "react-icons/md";
import ViewTravelStory from "./ViewTravelStory";
import EmptyCard from "../../components/Cards/EmptyCard";
import { DayPicker } from "react-day-picker";
import { getEmptyCardImg, getEmptyCardMesage } from "../../utils/helper";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [openAddEditModel, setOpenAddEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [openViewModel, setOpenViewModel] = useState({
    isShown: false,
    data: null,
  });

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("Error in loading :", error);
    }
  };

  const handleEdit = (data) => {
    setOpenAddEditModel({ isShown: true, type: "edit", data: data });
  };

  const handleViewStory = (data) => {
    setOpenViewModel({ isShown: true, data });
  };

  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    try {
      const response = await axiosInstance.put(
        "/update-is-favourite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );
      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        if (filterType === "search" && searchQuery) {
          onSearchStory(searchQuery);
        } else if (filterType === "date") {
          filterStoriesByDate(dateRange);
        } else {
          getAllStories();
        }
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again.");
    }
  };

  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId);
      if (response.data && !response.data.error) {
        toast.success("Story Deleted Successfully");
        setOpenViewModel((prevState) => ({ ...prevState, isShown: false }));
        getAllStories();
      }
    } catch (error) {
      console.log("an unexpected Error");
    }
  };

  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: { query },
      });
      if (response.data && response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      } else {
        console.log("No stories found.");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const handleClearSearch = () => {
    setFilterType("");
    getAllStories();
  };

  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day?.from ? moment(day.from).valueOf() : null;
      const endDate = day?.to ? moment(day.to).valueOf() : null;
      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-stories/filter", {
          params: { startDate, endDate },
        });
        if (response.data && response.data.stories) {
          setFilterType("date");
          setAllStories(response.data.stories);
        } else {
          console.log("No stories found for the selected date range.");
        }
      } else {
        console.warn("Invalid date range provided.");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const handleDayClick = (day) => {
    setDateRange(day);
    filterStoriesByDate(day).catch((error) => {
      console.error("Error filtering stories by date:", error);
    });
  };

  const resetFilter = () => {
    setDateRange({ from: null, to: null });
    setFilterType("");
    getAllStories();
  };

  useEffect(() => {
    getAllStories();
    getUserInfo();
    return () => { };
  }, []);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto py-10 px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <FilterInfoTitle
            filterType={filterType}
            filterDates={dateRange}
            onClear={() => {
              resetFilter();
            }}
          />
          <input
            type="text"
            placeholder="Search stories..."
            className="input-box w-full md:w-1/3 p-2 mt-4 md:mt-0 border border-gray-300 rounded"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") onSearchStory(searchQuery);
            }}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imageUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onEdit={() => handleEdit(item)}
                    onClick={() => handleViewStory(item)}
                    onFavouriteClick={() => updateIsFavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <EmptyCard
                imgSrc={getEmptyCardImg(filterType)}
                message={getEmptyCardMesage(filterType)}
              />
            )}
          </div>
          <div className="w-full md:w-[350px]">
            <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pageNavigation
                  styles={{
                    day: {
                      margin: "0.2rem",
                    },
                    day_selected: {
                      backgroundColor: "#0284c7",
                      color: "white",
                    },
                    day_rangeMiddle: {
                      backgroundColor: "#bae6fd",
                      color: "black",
                    },
                    day_rangeStart: {
                      backgroundColor: "#0284c7",
                      color: "white",
                    },
                    day_rangeEnd: {
                      backgroundColor: "#0284c7",
                      color: "white",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add & Edit Travel Story Modal */}
      <Modal
        isOpen={openAddEditModel.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <AddEditTravelStory
          type={openAddEditModel.type}
          storyInfo={openAddEditModel.data}
          onClose={() => {
            setOpenAddEditModel({ isShown: false, type: "add", data: null });
          }}
          getAllTravelStories={getAllStories}
        />
      </Modal>

      <Modal
        isOpen={openViewModel.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModel.data || null}
          onClose={() => {
            setOpenViewModel((prevState) => ({ ...prevState, isShown: false }));
          }}
          onEditClick={() => {
            setOpenViewModel((prevState) => ({ ...prevState, isShown: false }));
            handleEdit(openViewModel.data || null);
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModel.data || null);
          }}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModel({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </>
  );
}
