import React, { useRef, useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import RidesPage from '../pages/RidesPage';
import AddParkModal from './addParkModal';
import AddTripModal from './addTripModal';
import { SketchPicker } from 'react-color';
import ParkCard from './parkCard';
import TripCard from './tripCard';
import RidesTemplate from './RidesTemplate';


function Landing(){
    const [parks, setParks] = useState([]);
    const [showAddPark, setShowAddPark] = useState(false);
    const [selectedParkId, setSelectedParkId] = useState('');
    const [savedParks, setSavedParks] = useState([]);
    const [selectedPark, setSelectedPark] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showTripSearchBar, setShowTripSearchBar] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchInp, setSearchInp] = useState('');
    const [tripSearchInp, setTripSearchInp] = useState('');
    const [selectedColor, setSelectedColor] = useState('#000000'); 
    const [showColorPicker, setShowColorPicker] = useState(false);


    // added new variables may not use all of them
    const [trips, setTrips] = useState([]);
    const [showAddTrip, setShowAddTrip] = useState(false);
    const [selectedTripId, setSelectedTripId] = useState('');
    const [tripContent, setTripContent] = useState('');
    const [savedTrips, setSavedTrips] = useState([]);
    const [selectedDelTripId, setSelectedDelTripId] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    var response;

    const inputRef = useRef(null);
    const navigate = useNavigate();


    const app_name = 'group-22-0b4387ea5ed6';

    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return `https://${app_name}.herokuapp.com/${route}`;
        } else {
            return `http://localhost:5000/${route}`;
        }
    }

    //fetch all parks (for adding parks)
    useEffect(() => {
        fetchParks();
     }, []);

     //fetch users saved parks 
     useEffect(() => {
        if(checkIfUserIsNull() == true)
        {
            return;
        }
        fetchSavedParks();
        fetchSavedTrips();
    }, []);

    //if the user clicks anywhere else while searching it will toggle input off 
    useEffect(() => {
        const clickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSearchBar(false);
                setShowTripSearchBar(false);
            }
        };

        document.addEventListener('mousedown', clickOutside);
        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, []);

    //if a user tries to access saved parks w/o having logged in
    const checkIfUserIsNull = async () =>
    {
        if(localStorage.getItem('user_data') == null)
        {
            window.location.href = '/login';
            console.log("User is NULL!");
            return true;
        }
        return false;
    }

    //fetching all the parks from the api
    const fetchParks = async () =>{
        try{
            response = [
                {
                    "id": 11,
                    "name": "Cedar Fair Entertainment Company",
                    "parks": [
                        {
                            "id": 57,
                            "name": "California's Great America",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "37.397799",
                            "longitude": "-121.974717",
                            "timezone": "America/Los_Angeles"
                        },
                        {
                            "id": 58,
                            "name": "Canada's Wonderland",
                            "country": "Canada",
                            "continent": "North America",
                            "latitude": "43.843",
                            "longitude": "-79.539",
                            "timezone": "America/Toronto"
                        },
                        {
                            "id": 59,
                            "name": "Carowinds",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "35.1045",
                            "longitude": "-80.9394",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 50,
                            "name": "Cedar Point",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "41.4822",
                            "longitude": "-82.6835",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 69,
                            "name": "Dorney Park",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "40.577942",
                            "longitude": "-75.531528",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 62,
                            "name": "Kings Dominion",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "37.84",
                            "longitude": "-77.445",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 60,
                            "name": "Kings Island",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "39.3447",
                            "longitude": "-84.2686",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 61,
                            "name": "Knott's Berry Farm",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "33.8442",
                            "longitude": "-117.9986",
                            "timezone": "America/Los_Angeles"
                        },
                        {
                            "id": 70,
                            "name": "Michigan's Adventure",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "43.3474",
                            "longitude": "-86.2789",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 68,
                            "name": "Valleyfair",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "44.798742",
                            "longitude": "-93.453369",
                            "timezone": "America/Chicago"
                        },
                        {
                            "id": 63,
                            "name": "Worlds of Fun",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "39.177333",
                            "longitude": "-94.489028",
                            "timezone": "America/Chicago"
                        }
                    ]
                },
                {
                    "id": 15,
                    "name": "Compagnie des Alpes",
                    "parks": [
                        {
                            "id": 276,
                            "name": "Bellewaerde",
                            "country": "Belgium",
                            "continent": "Europe",
                            "latitude": "50.846996",
                            "longitude": "2.947948",
                            "timezone": "Europe/Brussels"
                        },
                        {
                            "id": 322,
                            "name": "Familypark",
                            "country": "Austria",
                            "continent": "Europe",
                            "latitude": "47.801597",
                            "longitude": "16.646089",
                            "timezone": "Europe/Vienna"
                        },
                        {
                            "id": 291,
                            "name": "Futuroscope",
                            "country": "France",
                            "continent": "Europe",
                            "latitude": "46.669167",
                            "longitude": "0.368889",
                            "timezone": "Europe/Paris"
                        },
                        {
                            "id": 9,
                            "name": "Parc Astérix",
                            "country": "France",
                            "continent": "Europe",
                            "latitude": "49.1341839",
                            "longitude": "2.5712301",
                            "timezone": "Europe/Paris"
                        },
                        {
                            "id": 14,
                            "name": "Walibi Belgium",
                            "country": "Belgium",
                            "continent": "Europe",
                            "latitude": "50.7018603",
                            "longitude": "4.5940362",
                            "timezone": "Europe/Brussels"
                        },
                        {
                            "id": 53,
                            "name": "Walibi Holland",
                            "country": "Netherlands",
                            "continent": "Europe",
                            "latitude": "52.44",
                            "longitude": "5.7625",
                            "timezone": "Europe/Amsterdam"
                        },
                        {
                            "id": 301,
                            "name": "Walibi Rhône-Alpes",
                            "country": "France",
                            "continent": "Europe",
                            "latitude": "45.621389",
                            "longitude": "5.570278",
                            "timezone": "Europe/Paris"
                        }
                    ]
                },
                {
                    "id": 10,
                    "name": "Herschend Family Entertainment",
                    "parks": [
                        {
                            "id": 55,
                            "name": "Dollywood",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "35.805702",
                            "longitude": "-83.528838",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 10,
                            "name": "Silver Dollar City",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "36.6704749",
                            "longitude": "-93.3370854",
                            "timezone": "America/Chicago"
                        }
                    ]
                },
                {
                    "id": 19,
                    "name": "Looping Group",
                    "parks": [
                        {
                            "id": 323,
                            "name": "Avonturenpark Hellendoorn",
                            "country": "Netherlands",
                            "continent": "Europe",
                            "latitude": "52.389444",
                            "longitude": "6.435833",
                            "timezone": "Europe/Amsterdam"
                        }
                    ]
                },
                {
                    "id": 17,
                    "name": "Mack Rides",
                    "parks": [
                        {
                            "id": 51,
                            "name": "Europa Park",
                            "country": "Germany",
                            "continent": "Europe",
                            "latitude": "48.268333",
                            "longitude": "7.720833",
                            "timezone": "Europe/Berlin"
                        },
                        {
                            "id": 309,
                            "name": "Rulantica",
                            "country": "Germany",
                            "continent": "Europe",
                            "latitude": "48.26082436",
                            "longitude": "7.7400571",
                            "timezone": "Europe/Berlin"
                        }
                    ]
                },
                {
                    "id": 6,
                    "name": "Merlin Entertainments",
                    "parks": [
                        {
                            "id": 1,
                            "name": "Alton Towers",
                            "country": "England",
                            "continent": "Europe",
                            "latitude": "52.9874651",
                            "longitude": "-1.8864769",
                            "timezone": "Europe/London"
                        },
                        {
                            "id": 3,
                            "name": "Chessington World of Adventures",
                            "country": "England",
                            "continent": "Europe",
                            "latitude": "51.3478981",
                            "longitude": "-0.3173283",
                            "timezone": "Europe/London"
                        },
                        {
                            "id": 12,
                            "name": "Gardaland",
                            "country": "Italy",
                            "continent": "Europe",
                            "latitude": "45.4550142",
                            "longitude": "10.7137527",
                            "timezone": "Europe/Rome"
                        },
                        {
                            "id": 25,
                            "name": "Heide Park",
                            "country": "Germany",
                            "continent": "Europe",
                            "latitude": "53.0236683",
                            "longitude": "9.8781907",
                            "timezone": "Europe/Berlin"
                        },
                        {
                            "id": 52,
                            "name": "Legoland Billund",
                            "country": "Denmark",
                            "continent": "Europe",
                            "latitude": "55.735556",
                            "longitude": "9.126111",
                            "timezone": "Europe/Copenhagen"
                        },
                        {
                            "id": 279,
                            "name": "Legoland California",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "33.126667",
                            "longitude": "-117.311111",
                            "timezone": "America/Los_Angeles"
                        },
                        {
                            "id": 278,
                            "name": "Legoland Deutschland",
                            "country": "Germany",
                            "continent": "Europe",
                            "latitude": "48.424444",
                            "longitude": "10.299722",
                            "timezone": "Europe/Berlin"
                        },
                        {
                            "id": 280,
                            "name": "Legoland Florida",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "27.989172",
                            "longitude": "-81.689936",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 285,
                            "name": "Legoland Japan",
                            "country": "Japan",
                            "continent": "Asia",
                            "latitude": "35.050556",
                            "longitude": "136.843333",
                            "timezone": "Asia/Tokyo"
                        },
                        {
                            "id": 315,
                            "name": "Legoland Korea",
                            "country": "South Korea",
                            "continent": "Asia",
                            "latitude": "37.88380399",
                            "longitude": "127.6974658",
                            "timezone": "Asia/Seoul"
                        },
                        {
                            "id": 299,
                            "name": "Legoland New York",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "41.37855043",
                            "longitude": "-74.31297395",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 27,
                            "name": "Legoland Windsor",
                            "country": "England",
                            "continent": "Europe",
                            "latitude": "51.4634423",
                            "longitude": "-0.649915",
                            "timezone": "Europe/London"
                        },
                        {
                            "id": 316,
                            "name": "Peppa Pig Theme Park Florida",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "27.98688038",
                            "longitude": "-81.6883981",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 2,
                            "name": "Thorpe Park",
                            "country": "England",
                            "continent": "Europe",
                            "latitude": "51.4039456",
                            "longitude": "-0.5143332",
                            "timezone": "Europe/London"
                        }
                    ]
                },
                {
                    "id": 9,
                    "name": "Other",
                    "parks": [
                        {
                            "id": 319,
                            "name": "Beto Carrero World",
                            "country": "Brazil",
                            "continent": "South America",
                            "latitude": "-26.802481",
                            "longitude": "-48.614367",
                            "timezone": "America/Sao_Paulo"
                        },
                        {
                            "id": 273,
                            "name": "Blackpool Pleasure Beach",
                            "country": "England",
                            "continent": "Europe",
                            "latitude": "53.790278",
                            "longitude": "-3.055556",
                            "timezone": "Europe/London"
                        },
                        {
                            "id": 318,
                            "name": "Cinecittà World",
                            "country": "Italy",
                            "continent": "Europe",
                            "latitude": "41.709032",
                            "longitude": "12.44673",
                            "timezone": "Europe/Rome"
                        },
                        {
                            "id": 290,
                            "name": "Djurs Sommerland",
                            "country": "Denmark",
                            "continent": "Europe",
                            "latitude": "56.425933",
                            "longitude": "10.550564",
                            "timezone": "Europe/Copenhagen"
                        },
                        {
                            "id": 160,
                            "name": "Efteling",
                            "country": "Netherlands",
                            "continent": "Europe",
                            "latitude": "51.650278",
                            "longitude": "5.048056",
                            "timezone": "Europe/Berlin"
                        },
                        {
                            "id": 317,
                            "name": "Energylandia",
                            "country": "Poland",
                            "continent": "Europe",
                            "latitude": "50.000115",
                            "longitude": "19.409078",
                            "timezone": "Europe/Warsaw"
                        },
                        {
                            "id": 18,
                            "name": "Fårup Sommerland",
                            "country": "Denmark",
                            "continent": "Europe",
                            "latitude": "57.2713353",
                            "longitude": "9.6505668",
                            "timezone": "Europe/Berlin"
                        },
                        {
                            "id": 166,
                            "name": "Grona Lund",
                            "country": "Sweden",
                            "continent": "Europe",
                            "latitude": "59.323333",
                            "longitude": "18.096667",
                            "timezone": "Europe/Berlin"
                        },
                        {
                            "id": 286,
                            "name": "Hansa Park",
                            "country": "Germany",
                            "continent": "Europe",
                            "latitude": "54.0769",
                            "longitude": "10.78",
                            "timezone": "Europe/Berlin"
                        },
                        {
                            "id": 15,
                            "name": "Hersheypark",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "40.2887809",
                            "longitude": "-76.6547469",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 314,
                            "name": "Knoebels",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "40.879",
                            "longitude": "-76.505",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 303,
                            "name": "Le Pal",
                            "country": "France",
                            "continent": "Europe",
                            "latitude": "46.507222",
                            "longitude": "3.630556",
                            "timezone": "Europe/Paris"
                        },
                        {
                            "id": 11,
                            "name": "Liseberg",
                            "country": "Sweden",
                            "continent": "Europe",
                            "latitude": "57.6952191",
                            "longitude": "11.9924641",
                            "timezone": "Europe/Stockholm"
                        },
                        {
                            "id": 320,
                            "name": "PanoraMagique",
                            "country": "France",
                            "continent": "Europe",
                            "latitude": "48.86901442",
                            "longitude": "2.78646006",
                            "timezone": "Europe/Paris"
                        },
                        {
                            "id": 49,
                            "name": "Paultons Park",
                            "country": "England",
                            "continent": "Europe",
                            "latitude": "50.948542",
                            "longitude": "-1.552557",
                            "timezone": "Europe/London"
                        },
                        {
                            "id": 56,
                            "name": "Phantasialand",
                            "country": "Germany",
                            "continent": "Europe",
                            "latitude": "50.8",
                            "longitude": "6.879444",
                            "timezone": "Europe/Berlin"
                        },
                        {
                            "id": 305,
                            "name": "Toverland",
                            "country": "Netherlands",
                            "continent": "Europe",
                            "latitude": "51.396",
                            "longitude": "5.986",
                            "timezone": "Europe/Amsterdam"
                        },
                        {
                            "id": 304,
                            "name": "Vulcania",
                            "country": "France",
                            "continent": "Europe",
                            "latitude": "45.813449",
                            "longitude": "2.940501",
                            "timezone": "Europe/Paris"
                        }
                    ]
                },
                {
                    "id": 18,
                    "name": "Parques Reunidos",
                    "parks": [
                        {
                            "id": 324,
                            "name": "Adventureland Resort",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "41.654447",
                            "longitude": "-93.499886",
                            "timezone": "America/Chicago"
                        },
                        {
                            "id": 311,
                            "name": "Bobbejaanland",
                            "country": "Belgium",
                            "continent": "Europe",
                            "latitude": "51.201111",
                            "longitude": "4.905",
                            "timezone": "Europe/Brussels"
                        },
                        {
                            "id": 312,
                            "name": "Kennywood",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "40.38682123",
                            "longitude": "-79.86212422",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 313,
                            "name": "Lake Compounce",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "41.64330388",
                            "longitude": "-72.92274692",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 310,
                            "name": "Movie Park Germany",
                            "country": "Germany",
                            "continent": "Europe",
                            "latitude": "51.6206067",
                            "longitude": "6.97212649",
                            "timezone": "Europe/Berlin"
                        },
                        {
                            "id": 321,
                            "name": "Parque de Atracciones Madrid",
                            "country": "Spain",
                            "continent": "Europe",
                            "latitude": "40.411289",
                            "longitude": "-3.751789",
                            "timezone": "Europe/Madrid"
                        },
                        {
                            "id": 298,
                            "name": "Parque Warner Madrid",
                            "country": "Spain",
                            "continent": "Europe",
                            "latitude": "40.23",
                            "longitude": "-3.5937",
                            "timezone": "Europe/Madrid"
                        }
                    ]
                },
                {
                    "id": 16,
                    "name": "Plopsa",
                    "parks": [
                        {
                            "id": 302,
                            "name": "Holiday Park",
                            "country": "Germany",
                            "continent": "Europe",
                            "latitude": "49.319722",
                            "longitude": "8.294722",
                            "timezone": "Europe/Berlin"
                        },
                        {
                            "id": 54,
                            "name": "Plopsaland De Panne",
                            "country": "Belgium",
                            "continent": "Europe",
                            "latitude": "51.079722",
                            "longitude": "2.596944",
                            "timezone": "Europe/Brussels"
                        }
                    ]
                },
                {
                    "id": 14,
                    "name": "PortAventura World",
                    "parks": [
                        {
                            "id": 277,
                            "name": "Ferrari Land",
                            "country": "Spain",
                            "continent": "Europe",
                            "latitude": "41.0878286",
                            "longitude": "1.1572475",
                            "timezone": "Europe/Madrid"
                        },
                        {
                            "id": 19,
                            "name": "PortAventura Park",
                            "country": "Spain",
                            "continent": "Europe",
                            "latitude": "41.0878286",
                            "longitude": "1.1572475",
                            "timezone": "Europe/Madrid"
                        }
                    ]
                },
                {
                    "id": 3,
                    "name": "SeaWorld Parks & Entertainment",
                    "parks": [
                        {
                            "id": 97,
                            "name": "Adventure Island",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "28.04174441",
                            "longitude": "-82.4131981",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 94,
                            "name": "Aquatica Orlando",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "28.41543304",
                            "longitude": "-81.45566791",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 306,
                            "name": "Aquatica San Antonio",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "29.45930638",
                            "longitude": "-98.69817399",
                            "timezone": "America/Denver"
                        },
                        {
                            "id": 24,
                            "name": "Busch Gardens Tampa",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "28.0363515",
                            "longitude": "-82.4224574",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 23,
                            "name": "Busch Gardens Williamsburg",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "37.235165",
                            "longitude": "-76.6465769",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 308,
                            "name": "Discovery Cove Orlando",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "28.40488484",
                            "longitude": "-81.46249679",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 21,
                            "name": "Seaworld Orlando",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "28.4114555",
                            "longitude": "-81.4617047",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 22,
                            "name": "Seaworld San Antonio",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "29.45836",
                            "longitude": "-98.700551",
                            "timezone": "America/Denver"
                        },
                        {
                            "id": 20,
                            "name": "Seaworld San Diego",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "32.7647903",
                            "longitude": "-117.2266083",
                            "timezone": "America/Los_Angeles"
                        },
                        {
                            "id": 29,
                            "name": "Sesame Place",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "29.6351835",
                            "longitude": "-95.3269418",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 96,
                            "name": "Water Country USA",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "37.26258412",
                            "longitude": "-76.63706537",
                            "timezone": "America/New_York"
                        }
                    ]
                },
                {
                    "id": 1,
                    "name": "Six Flags Entertainment Corporation",
                    "parks": [
                        {
                            "id": 282,
                            "name": "Frontier City",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "35.584845",
                            "longitude": "-97.44099",
                            "timezone": "America/Chicago"
                        },
                        {
                            "id": 48,
                            "name": "La Ronde, Montreal",
                            "country": "Canada",
                            "continent": "North America",
                            "latitude": "45.5225",
                            "longitude": "-73.535",
                            "timezone": "America/Toronto"
                        },
                        {
                            "id": 42,
                            "name": "Six Flags America",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "38.9062",
                            "longitude": "-76.77257",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 281,
                            "name": "Six Flags Darien Lake",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "42.92851",
                            "longitude": "-78.38488",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 33,
                            "name": "Six Flags Discovery Kingdom",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "38.1378",
                            "longitude": "-122.23",
                            "timezone": "America/Los_Angeles"
                        },
                        {
                            "id": 39,
                            "name": "Six Flags Fiesta Texas",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "29.5995",
                            "longitude": "-98.6094",
                            "timezone": "America/Chicago"
                        },
                        {
                            "id": 37,
                            "name": "Six Flags Great Adventure",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "40.137697",
                            "longitude": "-74.440458",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 38,
                            "name": "Six Flags Great America",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "42.369997",
                            "longitude": "-87.935794",
                            "timezone": "America/Chicago"
                        },
                        {
                            "id": 45,
                            "name": "Six Flags Great Escape",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "43.350991",
                            "longitude": "-73.690112",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 44,
                            "name": "Six Flags Hurricane Harbor New Jersey",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "40.137697",
                            "longitude": "-74.440458",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 40,
                            "name": "Six Flags Hurricane Harbor, Arlington",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "32.7557",
                            "longitude": "-97.070222",
                            "timezone": "America/Chicago"
                        },
                        {
                            "id": 293,
                            "name": "Six Flags Hurricane Harbor, Concord",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "37.974",
                            "longitude": "-122.0512",
                            "timezone": "America/Los_Angeles"
                        },
                        {
                            "id": 41,
                            "name": "Six Flags Hurricane Harbor, Los Angeles",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "34.424918",
                            "longitude": "-118.594425",
                            "timezone": "America/Los_Angeles"
                        },
                        {
                            "id": 292,
                            "name": "Six Flags Hurricane Harbor, Oaxtepec",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "18.8967",
                            "longitude": "-98.9754",
                            "timezone": "America/Mexico_City"
                        },
                        {
                            "id": 294,
                            "name": "Six Flags Hurricane Harbor, Oklahoma City",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "33.959128",
                            "longitude": "-84.519548",
                            "timezone": "America/Chicago"
                        },
                        {
                            "id": 295,
                            "name": "Six Flags Hurricane Harbor, Phoenix",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "33.6962",
                            "longitude": "-112.1503",
                            "timezone": "America/Phoenix"
                        },
                        {
                            "id": 297,
                            "name": "Six Flags Hurricane Harbor, Rockford",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "42.370244",
                            "longitude": "-87.935916",
                            "timezone": "America/Chicago"
                        },
                        {
                            "id": 296,
                            "name": "Six Flags Hurricane Harbor, SplashTown",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "30.5088",
                            "longitude": "-95.4919",
                            "timezone": "America/Chicago"
                        },
                        {
                            "id": 32,
                            "name": "Six Flags Magic Mountain",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "34.4238",
                            "longitude": "-118.5971",
                            "timezone": "America/Los_Angeles"
                        },
                        {
                            "id": 47,
                            "name": "Six Flags Mexico",
                            "country": "Mexico",
                            "continent": "North America",
                            "latitude": "19.295",
                            "longitude": "-99.209",
                            "timezone": "America/Toronto"
                        },
                        {
                            "id": 43,
                            "name": "Six Flags New England",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "42.0377",
                            "longitude": "-72.6157",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 35,
                            "name": "Six Flags Over Georgia",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "33.76787",
                            "longitude": "-84.55065",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 34,
                            "name": "Six Flags Over Texas",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "32.7557",
                            "longitude": "-97.070222",
                            "timezone": "America/Chicago"
                        },
                        {
                            "id": 36,
                            "name": "Six Flags St. Louis",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "38.512806",
                            "longitude": "-90.67505",
                            "timezone": "America/Chicago"
                        },
                        {
                            "id": 46,
                            "name": "Six Flags White Water, Atlanta",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "33.958056",
                            "longitude": "-84.521389",
                            "timezone": "America/New_York"
                        }
                    ]
                },
                {
                    "id": 20,
                    "name": "UK National Museums",
                    "parks": [
                        {
                            "id": 326,
                            "name": "British Museum",
                            "country": "England",
                            "continent": "Europe",
                            "latitude": "51.51920634",
                            "longitude": "-0.12726773",
                            "timezone": "Europe/London"
                        },
                        {
                            "id": 325,
                            "name": "Natural History Museum",
                            "country": "England",
                            "continent": "Europe",
                            "latitude": "51.496111",
                            "longitude": "-0.176389",
                            "timezone": "Europe/London"
                        }
                    ]
                },
                {
                    "id": 12,
                    "name": "Universal Parks & Resorts",
                    "parks": [
                        {
                            "id": 64,
                            "name": "Islands Of Adventure At Universal Orlando",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "28.472243",
                            "longitude": "-81.4678556",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 65,
                            "name": "Universal Studios At Universal Orlando",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "28.4749822",
                            "longitude": "-81.466497",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 66,
                            "name": "Universal Studios Hollywood",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "34.137261",
                            "longitude": "-118.355516",
                            "timezone": "America/Los_Angeles"
                        },
                        {
                            "id": 284,
                            "name": "Universal Studios Japan",
                            "country": "Japan",
                            "continent": "Asia",
                            "latitude": "34.665482",
                            "longitude": "135.43236",
                            "timezone": "Asia/Tokyo"
                        },
                        {
                            "id": 67,
                            "name": "Universal Volcano Bay",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "28.4623",
                            "longitude": "-81.4707",
                            "timezone": "America/New_York"
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "Walt Disney Attractions",
                    "parks": [
                        {
                            "id": 8,
                            "name": "Animal Kingdom",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "28.3530666",
                            "longitude": "-81.5911943",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 17,
                            "name": "Disney California Adventure",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "33.8058755",
                            "longitude": "-117.9194899",
                            "timezone": "America/Los_Angeles"
                        },
                        {
                            "id": 7,
                            "name": "Disney Hollywood Studios",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "28.3575294",
                            "longitude": "-81.5582714",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 6,
                            "name": "Disney Magic Kingdom",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "28.417663",
                            "longitude": "-81.581212",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 16,
                            "name": "Disneyland",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "33.8104856",
                            "longitude": "-117.9190001",
                            "timezone": "America/Los_Angeles"
                        },
                        {
                            "id": 31,
                            "name": "Disneyland Hong Kong",
                            "country": "Hong Kong",
                            "continent": "Asia",
                            "latitude": "22.3133",
                            "longitude": "114.0433",
                            "timezone": "Asia/Hong_Kong"
                        },
                        {
                            "id": 4,
                            "name": "Disneyland Park Paris",
                            "country": "France",
                            "continent": "Europe",
                            "latitude": "48.8722344",
                            "longitude": "2.7758079",
                            "timezone": "Europe/Paris"
                        },
                        {
                            "id": 5,
                            "name": "Epcot",
                            "country": "United States",
                            "continent": "North America",
                            "latitude": "28.374694",
                            "longitude": "-81.549404",
                            "timezone": "America/New_York"
                        },
                        {
                            "id": 30,
                            "name": "Shanghai Disney Resort",
                            "country": "China",
                            "continent": "Asia",
                            "latitude": "31.144",
                            "longitude": "121.657",
                            "timezone": "Asia/Shanghai"
                        },
                        {
                            "id": 274,
                            "name": "Tokyo Disneyland",
                            "country": "Japan",
                            "continent": "Asia",
                            "latitude": "35.634848",
                            "longitude": "139.879295",
                            "timezone": "Asia/Tokyo"
                        },
                        {
                            "id": 275,
                            "name": "Tokyo DisneySea",
                            "country": "Japan",
                            "continent": "Asia",
                            "latitude": "35.627055",
                            "longitude": "139.889097",
                            "timezone": "Asia/Tokyo"
                        },
                        {
                            "id": 28,
                            "name": "Walt Disney Studios Paris",
                            "country": "France",
                            "continent": "Europe",
                            "latitude": "48.8673",
                            "longitude": "2.779008",
                            "timezone": "Europe/Paris"
                        }
                    ]
                }
            ];
            const data = await response;
            const parsedData = extractParkInfo(data);
            setParks(parsedData);
            setIsLoading(false);
        } catch(error){
            console.error(error);
        }
    };

    //fetching the users SAVED parks (not all parks)

    const fetchSavedParks = async () => {
        try {
            const userDataString = localStorage.getItem('user_data');
            const userData = JSON.parse(userDataString);

            //console.log(userData)
            
            //saved parks only saved ids and not names so fetch park names and match
            const savedParks = userData.saved_parks || [];
            //console.log('savedPark IDS:', userData.saved_parks);

            

            const data = await response;
            const parsedData = extractParkInfo(data);

            //match the ids with their corresponding park names! 
            const savedParkIds = savedParks.map (id => parseInt(id));
            const savedParkNames = savedParkIds.map (parkID =>{
                const park = parsedData.find(p=>p.id === parkID);
                return park ? park.name : '';
            });

            //update the saved parks to store their names!
            setSavedParks(savedParkNames); 
            console.log("savedParkNames:", savedParkNames);
            return savedParkNames;
        } catch (error) {
            console.error ('Error fetching the saved parks: ', error);
            return undefined;
        }
    };

    const fetchSavedTrips = async () => {
        try {
            const userDataString = localStorage.getItem('user_data');
            const userData = JSON.parse(userDataString);
            const userID = userData.id
            //saved parks only saved ids and not names so fetch park names and match
            const savedTrips = userData.saved_trips || [];
            console.log('savedTrip IDS:', userData.saved_trips);

            const response = await fetch(buildPath('api/searchTrip'),{
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({
                    search : "",
                    userID : userID
                })
            });

            if(!response.ok){
                throw new Error('error fetching trips');
            }

            const data = await response.json();
            var extractedTripInfo = extractTripInfo(data);
            
            //update the saved parks to store their names!
            setSavedTrips(extractedTripInfo); 
            console.log("extractedTripInfo: ", extractedTripInfo);
            return extractedTripInfo;
        } catch (error) {
            console.error ('Error fetching the saved parks: ', error);
            return undefined;
        }
    };

    const extractTripInfo = (jsonData) => {
        // Ensure 'results' property exists and is an array
        if (!jsonData || !Array.isArray(jsonData['results']) || !jsonData['results'].length) {
          return []; // Return empty array if 'results' is missing, not an array, or empty
        }
      
        const trips = [];
        const tripLength = 4; // Constant for trip info length
      
        // Iterate through results, checking for validity within the array
        for (let i = 0; i < jsonData['results'].length; i += tripLength) {
          if (i + tripLength <= jsonData['results'].length) {
            const trip = [
              jsonData['results'][i],
              jsonData['results'][i + 1],
              jsonData['results'][i + 2],
              jsonData['results'][i + 3],
            ];
            trips.push(trip);
          }
        }
      
        return trips;
      };
      
      

    const extractParkInfo = (jsonData) => {
        return jsonData.flatMap((company) => company.parks.map((park) =>({
            id: park.id,
            name : park.name
        })));
    };

    //ensure that the dropdown/etc is only displayed when set show is true 
    const addPark = () => {
        setShowAddPark(true);
        /*
        const div = document.getElementById('trip_form');
        if (div.style.display != 'none') {
            div.style.display = 'none';
        }
        document.getElementById('parkSelect').value = '';
        */
    };

    //add a park 
    const addParkSubmit = async () => {
        const userDataString = localStorage.getItem('user_data');
        const userData = JSON.parse(userDataString);

        const userID = userData.id;

        if (!selectedParkId){
            console.error('No park selected');
            return;
        }

        try{
            const response = await fetch(buildPath('api/addPark'), {
                method: 'POST', 
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    userID: userID,  
                    parkID: parseInt(selectedParkId)
                })
            });

            if (!response.ok){
                throw new Error ('Failed to add park');
            }

            const responseData = await response.json();
            //debug 
            console.log("responseData.message: ", responseData.message);

            console.log('Selected Park ID:', selectedParkId);
            console.log('Parks Array:', parks);

            //update saved parks to include newly added park
            const selectedPark = parks.find(park => park.id === parseInt(selectedParkId));
            if (selectedPark) {
                setSavedParks(prevSavedParks => [...prevSavedParks, selectedPark.name]);
                const updatedSavedParks = [...userData.saved_parks, parseInt(selectedParkId)];
                userData.saved_parks = updatedSavedParks;
                localStorage.setItem('user_data', JSON.stringify(userData));

            } else {
                console.error('Selected park not found');
            }
            //update park list after adding a new 
            //await fetchSavedParks();

            //console.log(savedParks);
            setShowAddPark(false);
        }catch(error){
            console.error(error);
        }
    };

    const addTrip = () => {
        setShowAddTrip(!showAddTrip);
       /* const div = document.getElementById('trip_form');
        if (div.style.display === 'none') {
            div.style.display = 'block'; // Or 'flex', 'grid', etc., depending on your layout needs
        } else {
            div.style.display = 'none';
        }
        document.getElementById('parkSelect').value = ''; 
        */
    };

    var parkID;
    var tripID;
    var tripName;

    const setTripID = async (id) =>
    {
        tripID = id
    }
    const setParkID = async (id) =>
    {
        parkID = parseInt(id)
    }
    const setTripName = async (name) =>
    {
        tripName = name
    }

    useEffect(() => {
        parkID = parseInt(selectedParkId)
        
        }, [selectedParkId]); // Only re-run the effect if selectedRideId changes

    const addTripSubmit = async (ele) => {
        const userDataString = localStorage.getItem('user_data');
        const userData = JSON.parse(userDataString);
        console.log("userData: ", userData);
        const userID = userData.id;

        var addTripObj = {
            name: tripName, 
            startDate: ele.startDate,
            endDate: ele.endDate,
            userID: userID,  
            parkID: parkID
        }
        console.log(addTripObj)
        console.log(JSON.stringify(addTripObj))
        try{
            const response = await fetch(buildPath('api/addTrip'), {
                method: 'POST', 
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(addTripObj)
            });

            if (!response.ok){
                throw new Error ('Failed to add Trip');
            }

            const responseData = await response.json();
            //debug 
            console.log("responseData.message: ", responseData.message);
            
            fetchSavedTrips();
            // console.log('Trips Array:', trip);
            // console.log('Rides Aray', rides);

            //uodate saved parks immediately
            // const selectedTrip = savedTrips.find(trip => trip.tripID === parseInt(selectedTripId));
            // if (selectedTrip) {
            //     // Update savedParks state to include the newly added park
            //     setSavedParks(prevSavedParks => [...prevSavedParks, selectedTrip]);
            // } else {
            //     console.error('Selected park not found');
            // }
            //update park list after adding a new 
            //await fetchSavedParks();

            //console.log(savedParks);
            //setShowAddTrip(false);
        }catch(error){
            console.error(error);
        }
    };


    // addTrip:
    // 1. html gets userinput, like start/end dates, name of trip, name of park, etc
    // 2. addtrip is called from this html code, and it creates a json object with the userinput. this represents one visit to a park.
    // 3. addtrip needs to then add the json object to an array of json objects, where each json object, again,  represents a visit to a particular park.
    // 4. these array of json objects need to be stored somewhere, maybe on mongodb? 
    
    // Trip = array of json objects. One visit to a park = a single json object
    
    // editTrip:
    // 1. everytime a user wants to add more visits to a trip, he would click this button. this is a html step. userinput about an additional trip will be collected here, just like in addTrip
    // 2. editTrip is called from the the html code and makes a json object with the userinput. It then inserts this json object to the trip (which, if you recall, is an array of json objects).
    
    // This guide doesn't include handling how to add individual rides to each trip. Maybe this can be done by having an array within each json object with the list of all the rides the user wants to go to. The user would fill out this array through html as well.


    async function searchTrip(search){
        try{
            console.log('trip to search', search)
            //const searchTrip = await
            const userDataString = localStorage.getItem('user_data');
            const userData = JSON.parse(userDataString);
            const userID = userData.id;
            
            const response = await fetch('/api/searchTrip',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userID: userID, search: search})
            });
            const data = await response.json();
            console.log("data: ", data)
            console.log("searchTrip Function")
            return data;
            
        }catch(error){
            console.error(error);
        }
    }

    //delete park endpoint 
    const deletePark = async (parkName) => {
        const confirmation = window.confirm (`Are you sure you want to delete ${parkName}? This action cannot be undone.`);
        if (confirmation){
            //debug
            //console.log('park to delete:', parkName);
            const savedParks = await fetchSavedParks();
            //console.log('savedParks before del:', savedParks);

            //find the park to del! 
            const park = parks.find(park => park.name === parkName);
            console.log('Park info to del:', park);
            if (!park){
                console.log('Park not found');
                return;
            }

            const updatedSaved = savedParks.filter(savedPark => savedPark !== parkName);
            console.log('updatedlist:', updatedSaved);

            const userDataString = localStorage.getItem('user_data');
            const userData = JSON.parse(userDataString);
       
            const parkID = park.id;
            const updatedIDs = userData.saved_parks.filter(savedPark => savedPark != parkID)
            userData.saved_parks = updatedIDs;
            console.log(JSON.stringify(userData))
            localStorage.setItem('user_data', JSON.stringify(userData));

            try {
                //fetching and actual deletion from the endpoint 
                const response = await fetch(buildPath('api/deletePark'),{
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({
                        userID : userData.id,
                        parkID: parseInt(parkID)
                     })
                });

                if (!response.ok){
                throw new Error('Failed to delete park');
                }

                setSavedParks(updatedSaved);
                console.log('saved parks afterDel',updatedSaved);
                //get message from response
                const responseData = await response.json();
                console.log(responseData.message);
            } catch(error){
                console.error(error);
            }
        } else {
            console.log(`Deletion of ${parkName} cancelled`);
        }
    };



 //delete trip endpoint 
 const deleteTrip = async (tripName) => {
    //debug
    console.log('trip to delete:', tripName);
    const savedTrips = await fetchSavedParks();
    console.log('savedTrips before del:', savedTrips);

    //find the trip to del! 
    const trip = trips.find(trip => trip.name === tripName);
    console.log('Trip info to del:', trip);
    if (!trip){
        console.log('Trip not found');
        return;
    }

    const updatedSaved = savedTrips.filter(savedTrip => savedTrip !== tripName);
    console.log('updatedlist:', updatedSaved);

    const userDataString = localStorage.getItem('user_data');
    const userData = JSON.parse(userDataString);
   
    const tripID = trip.id;
    const updatedIDs = userData.saved_trips.filter(savedTrip => savedTrip != tripID)
    userData.saved_trips = updatedIDs;
    console.log(JSON.stringify(userData))
    localStorage.setItem('user_data', JSON.stringify(userData));

    try {
        //fetching and actual deletion from the endpoint 
        const response = await fetch(buildPath('api/deletePark'),{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                userID : userData.id,
                name: userData.name
            })
        });

        if (!response.ok){
            throw new Error('Failed to delete trip');
        }

        setSavedParks(updatedSaved);
        console.log('saved trip afterDel',updatedSaved);
        //get message from response
        const responseData = await response.json();
        console.log(responseData.message);
    } catch(error){
        console.error(error);
    }
};

const fetchRides = async event => {
    var obj = {parkID:parkID};
    var js = JSON.stringify(obj);

    try {    
        const response = await fetch(buildPath('api/rides'), {headers:{'Content-Type': 'application/json'}, body:js, method: 'POST'});
        console.log(`response status is ${response.status}`);
        const mediaType = response.headers.get('content-type');
        let data;
        if (mediaType.includes('json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }
        console.log(data);
        var ridesData = data;
        var rides = extractRideInfo(ridesData);

        return rides;
    }
    catch(e) {
        alert(e.toString());
        return;
    }    
};


function extractRideInfo(jsonData) 
{
    const rideInfo = [];
    // Iterate over each land
    for (const land of jsonData.lands) 
    {
        // Iterate over rides in each land
        for (const ride of land.rides) 
        {
            // Extract ride name and wait time
            const rideName = ride.name;
            const waitTime = ride.wait_time;
            const isOpen = ride.is_open;
            const id = ride.id
            // Add ride info to rideInfo array
            rideInfo.push({ id: id, name: rideName, wait_time: waitTime, is_open:isOpen });
        }
    }
    return rideInfo;
}

const seeTripDetails = async(trip) => {
    navigate(`/trips/${trip[1]}`); 
}



    const seeWaitTimes = (parkName) => {
        const selectPark = parks.find(park => park.name === parkName); 
        const selectedPark = selectPark.id
        console.log(selectedPark);
        console.log('park to see wait list', selectPark);
        
        if (selectPark){
           setSelectedPark(selectedPark);
           console.log('waitlist park id:', selectedPark);
           console.log('selectedparkid var:', selectedPark);
           navigate(`/rides/${selectedPark}`); 
        } else{
            console.log('Park not found');
        }
    };


    const logOut = async () => {
        navigate(`/login`);
        console.log('logging user out!');
    };



    const toggleSearchBar= () => {
        setShowSearchBar(!showSearchBar);
        
    };

    const toggleTripSearchBar= () => {
        setShowTripSearchBar(!showTripSearchBar);
    }

// delete park will be used to edit trips to delete parks in it
// Will change this to edit trip
    async function updateTrip(tripID, name, startDate, endDate){
        const response = await fetch('/api/updateTrip',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ tripID, name, startDate, endDate})
        });
        const data = await response.json();
        console.log(data)
        console.log("updateTrip Function")
        return data;
    }
    
{/* <style>
    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
    }

    .form-group select,
    .form-group input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }
</style>
     */}

    //search through saved parks 
    const searchPark = async () => {
        const filteredParks = savedParks.filter(park => park.toLowerCase().includes(searchInp.toLowerCase()));
        setSearchResults(filteredParks);
    }

    const searchTrips = async () => {
        const filteredTrips = savedTrips.filter(trip => trip.toLowerCase().includes(tripSearchInp.toLowerCase()));
        setSearchResults(filteredTrips);
    }

    //for the color selector!! (when the user wants to change the park card color )
    const toggleColorPicker = () => {
        setShowColorPicker(!showColorPicker);
    };

    const changeColor = (color) => {
        setSelectedColor(color.hex);
        setShowColorPicker(false); 
    };

    return (
        <div id="app">
          <div className="landing">
            <div style={{ height: '100%' }}>
              <div className="inner-landing">
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
                  <header style={{ background: '#f78254', maxWidth: '100vw', userSelect: 'none' }}>
                    <div className="topbar" style={{ width: '100%', maxWidth: '100vw', height: '32px', opacity: '1', transition: 'opacity 700ms ease 0s, color 700ms ease 0s', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden', height: '32px', paddingLeft: '12px', paddingRight: '10px' }}>
                        {/* this for the top bar content */}
                        <div className="logoutCont">
                          <button className="logoutButton" onClick={() => logOut()}>Logout</button>
                        </div>
                      </div>
                    </div>
                  </header>
                  <main className="frame" style={{ display: 'flex', flexDirection: 'column', height: 'calc(-45px + 100vh)' }}>
                    <div style={{ flex: '1', overflowY: 'auto' }}>
                      <section className="saved-parks">
                        <div className="saved-section">
                          <div id="saved-title">
                            <h3>Saved Parks</h3>
                          </div>
                          <div id="title-icons">
                            <div className="addPark">
                              <button id="addParkBtn" onClick={addPark}>Add Park</button>
                            </div>
                            <button className="searchBtn" onClick={toggleSearchBar}>Search</button>
                            {showSearchBar && (
                              <div className="searchBar" ref={inputRef}>
                                <input
                                  type="text"
                                  value={searchInp}
                                  onChange={(e) => {
                                    setSearchInp(e.target.value);
                                    searchPark();
                                  }}
                                  placeholder="Search Park"
                                />
                              </div>
                            )}
                          </div>
                          <div className="borderBttm"></div>
                        </div>
                        <div className="scroll">
                          <div className="parkCardCont">
                            {(searchInp ? searchResults : savedParks).map((park, index) => (
                              <ParkCard
                                key={index}
                                park={park}
                                deletePark={deletePark}
                                seeWaitTimes={seeWaitTimes}
                              />
                            ))}
                          </div>
                        </div>
                      </section>
      
                      <section className="saved Trips">
                        <div className="saved-section">
                          <div id="saved-title">
                            <h3>Planned Trips</h3>
                          </div>
                          <div id="title-icons">
                            <button id="addTripBtn" onClick={addTrip}>Add trip</button>
                            <button className="searchBtnTrip" onClick={toggleTripSearchBar}>Search</button>
                            {showTripSearchBar && (
                              <div className="searchBar" ref={inputRef}>
                                <input
                                  type="text"
                                  value={tripSearchInp}
                                  onChange={(e) => {
                                    setTripSearchInp(e.target.value);
                                    searchTrips();
                                  }}
                                  placeholder="Search Trip"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="borderBttm"></div>
                        <div className="scroll">
                          <div className="parkCardCont">
                            {isLoading ? (
                              <p>Loading parks...</p>
                            ) : (
                              savedTrips.map((trip, index) => (
                                <TripCard
                                  key={index}
                                  trip={trip}
                                  deleteTrip={deleteTrip}
                                  seeTripDetails={seeTripDetails}
                                  park={parks.find(park => park.id === trip[2]).name}
                                />
                              ))
                            )}
                          </div>
                        </div>
                        {/*<button onClick={toggleAddTripDiv}>Add trip</button>*/}
                        <div id='trip_form' style={{ display: 'none' }}>
                          <form id='trip_data'>
                            <div>
                              <label htmlFor="trip_name">Trip Name:</label>
                              <input type="text" id="trip_name" name="trip_name" placeholder="Trip Name" required></input>
                            </div>
                            <div>
                              <label htmlFor="trip_startDate">Start Date:</label>
                              <input type="date" id="trip_startDate" name="trip_startDate"></input>
                            </div>
                            <div>
                              <label htmlFor="trip_endDate">End Date:</label>
                              <input type="date" id="trip_endDate" name="trip_endDate"></input>
                            </div>
                            <div>
                              <label>Choose a Park: </label>
                              <select id='parkSelect' onChange={(e) => setSelectedParkId(e.target.value)}>
                                <option id='trip_park' value="">Select a park... </option>
                                {parks.map((park, index) => (
                                  <option key={index} value={park.id}>{park.name}</option>
                                ))}
                              </select>
                              <div>
                            {/* store ride in a json object and than display it */}
                              <label>Choose a Ride: </label>
                              <select id='rideSelect' onChange={(e) => setSelectedParkId(e.target.value)}>
                                <option id='trip_rides' value="">Select a ride... </option>
                                {parks.map((park, index) => (
                                  <option key={index} value={park.id}>{park.name}</option>
                                ))}
                              </select>




                              {/* <div className="parkCardCont">
                                {(searchInp ? searchResults : savedParks).map((park, index) => (
                                <ParkCard
                                    key={index}
                                    park={park}
                                    deletePark={deletePark}
                                    seeWaitTimes={seeWaitTimes}
                                />
                                ))} */}
                            </div>
                            </div>
                            <button onClick={addTripSubmit}>Create Trip</button>
                          </form>
                        </div>
                      </section>
                    </div>
                  </main>
                </div>
              </div>
            </div>
          </div>
          {selectedPark && <RidesPage parkID={selectedPark} />}
          {showAddPark && (
            <AddParkModal
              parks={parks}
              setSelectedParkId={setSelectedParkId}
              addParkSubmit={addParkSubmit}
              setShowAddPark={setShowAddPark}
            />
          )}
          {showAddTrip && (
            <AddTripModal
              addTripSubmit={addTripSubmit}
              parks={parks}
              setShowAddTrip={setShowAddTrip}
              handleParkChange={setParkID}
              handleNameChange={setTripName}
            />
          )}
        </div>
      );
      
};

export default Landing;