import React from 'react';
import { useState , useEffect} from 'react';
import "./Search.css"
import { Space } from 'antd';
import SelectBox from '../../SelectBox';
import api from "../../core/data/api";
import { Link } from 'react-router-dom';
import Header from '../../core/common/header';

const dataList = [
    { title: "Property Size", subtitle: "", value: "1200", extra: "+524k" },
    { title: "Income From Property", subtitle: "", value: "500", extra: "+524k" },
    { title: "Perchase Price", subtitle: "", value: "5000", extra: "+524k" },
    { title: "Percentage Down", subtitle: "", value: "2000", extra: "+524k" },
    { title: "Interst Rate", subtitle: "", value: "9000", extra: "+524k" },
  
];


const SearchPage = () => {
    const [states, setStates] = useState([]);
    const [selectedSeacrh, setSelectedSeacrh] = useState("");
const [selectedState, setSelectedState] = useState<{ name?: string }>({});
const searches = ["Residential", "Commercial ", "Land", "All"];

const getStates = async () => {
    try {
      const res = await api.get("/api/appdata/states");
      if (res.data.success) {
        setStates(res.data.states);
      }
    } catch (error) {}
  };
  

  useEffect(() => {
    getStates();
  }, []);

    return (
        <div className='main' >
          
            <Header/>
            
           
           
 <div className="row  w-100 searchResultDiv "   style={{marginBottom:"10px",marginTop:"50px"}}>
 <h1 style={{justifyContent:"center",alignItems:"center" ,width:"100%",display:"flex"
,marginBottom:"10px"

 }}>
        Refine Your Search
    </h1>
        <div className="col-md-6 mx-auto" >
       
          <div
            className="input-group position-relative"
          
            
          >
            <i
              className="ti ti-search search-icon"
              style={{ marginRight: "10px" }}
            />
            <input
            
              type="text"
              className="form-control bg-white "
              style={{ paddingLeft: "40px",borderRadius:"15px",marginRight:"10px" }}
              placeholder="Enter Zipcode / City"
              aria-label="Search"
              aria-describedby="basic-addon2"
            //   value={search}
            //   onChange={_handleChange}
            />

            <div className="home-select">
              <SelectBox
                options={states}
                setselected={setSelectedState}
                selected={selectedState ? selectedState : {}}
                type="states"
              />
            </div>

            <div className="input-group-append">
              <Link
                to={"/search"}
                className="btn"
                style={{ background: "#082656", color: "#fff",height:"39px" }}
                type="button"
                onClick={(e) => {
                //   if (!isAuthenticated) {
                //     e.preventDefault(); // Prevent navigation
                //     setshowMessage(true);
                //   }
                }}
              >
                Search
              </Link>
            </div>
          </div>
          <div
            className="d-flex align-items-center justify-content-start mt-3 flex-wrap"
            style={{
              alignItems: "center",
              margin: "0 auto",
            }}
          >
            <div >Select Property Type: </div>
            {searches.map((s: any, idx) => (
              <div
                key={s}
                className="mx-2 rounded px-2 py-1"
                style={{  color: "black" }}
              >
                <input
                  type="radio"
                  name="property"
                  id={s}
                  className="form-check-input"
                  defaultChecked={s === "All"}
                />
                <label className="form-check-label mx-2" htmlFor={s}>
                  {s}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

            <div className='left-content'>
                {/* <div className="input-box">
                    <input
                        type="search"
                        name="search-form"
                        id="search-form"
                        className="search-input"
                        placeholder="Search here.."
                    />
                </div> */}
                <h1>
                    Search Result
                </h1>
                <div className='searchResultDiv'>
                <h2 style={{marginBottom:"5px"}}>
                    Your search for <strong>"item Search"</strong>
                </h2>
                <h4 >
                    Property type :<strong> Residential</strong>
                </h4>
                </div>
             
                <div className="grid-container">
                    {dataList.map((item, index) => (
                        <div key={index} className="grid-item">
                            <h3>
                                {item.title}
                            </h3>
                            <h5 className='ligthGreyColorText'>
                                {item.subtitle}
                            </h5>

                            <div className='bottomFistCon'>
                                <h2 className="widgetTitleStyle">{item.value}</h2>
                                {/* <div className='extraDiv'>
                                    {item.extra && <span style={{ color: 'black' }} className="widgetSubtitleStyle">{item.extra}</span>}

                                </div> */}
                            </div>

                        </div>
                    ))}
                </div>

            </div>

            <div className='right-content'>
                <h1 className="" >
                    Result Graph

                </h1>
                <div className='secondMain'>
                    <div>
                        <h1>
                            Search
                        </h1>
                        <h5>
                            Search graph is showing here you can review it
                        </h5>

                        <h1>
                            2342
                        </h1>
                    </div>

                    <div className="circleStyle">
                        <span>75%</span>
                    </div>
                </div>
                <div className='graphDiv'>

                    <h1>
                       
                    </h1>

                </div>
            </div>


        </div>
    )
}

export default SearchPage