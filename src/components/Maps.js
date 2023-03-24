import React, { useState, useEffect } from 'react'
//import { useCookies } from 'react-cookie'
//import Cookies from 'universal-cookie'
import { GoogleMap, useJsApiLoader, Polyline } from '@react-google-maps/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material'; 



const containerStyle = {
width: '500px',
height: '300px'
};

const options = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    zIndex: 1
};  


export default function Maps() {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('code');
        //const destination = "http://localhost:3000/profile";
        const destination = "http://ecm2434-group-project.web.app/profile";
        if (token != null) {
          window.location.replace(destination);
        }
      }, []);
    
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const decodePolyline = require('decode-google-map-polyline');

    const [line, setLine] = useState([])
    //const cks = new Cookies();
    //const [setCookie] = useCookies(['cookie-name']);
    const client_id="103170";
    const client_secret = "8ca06c5186df7b04f642f89bc302228e4ce28a57";
    const activitiesURL = `https://www.strava.com/api/v3/athlete/activities?access_token=`
    let athleteLatestActivity = []
    let response_data = {}
    let access_token = ""
    let refresh_token = ""
    let access_token_expiry;

    const navigate = useNavigate();
    const CheckAccessToken = () => {
        if (access_token_expiry < 0) {
            navigate('/strava')
        }
    }

    const SendRequest = () =>{
        console.log(code)
        axios.post(`https://www.strava.com/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=authorization_code`).then(res =>{
        console.log("Data from post request", res.data);
        response_data = res.data;
        access_token = response_data.access_token
        refresh_token = response_data.access_token
        access_token_expiry = response_data.expires_in
        console.log("Access token expiry: ", access_token_expiry)
        //setCookie("refreshToken", refresh_token)
        //setCookie("accessToken", access_token, { maxAge: res.data.expires_in })
        localStorage.setItem("STRAVA_ACCESS_TOKEN", access_token);
        localStorage.setItem("STRAVA_REFRESH_TOKEN", refresh_token);
        const accessToken = localStorage.getItem("STRAVA_ACCESS_TOKEN");
        //const refreshToken = localStorage.getItem("STRAVA_REFRESH_TOKEN");
        console.log("ACCESS TOKEN: ", accessToken)
        console.log("Successfully got token", access_token)}).catch(e =>{
          console.log(e);
        }).then(GetAthleteActivities).then(GetPolyline).then(CheckAccessToken)
    }
    
    const GetAthleteActivities = () =>{
      axios.get(activitiesURL + localStorage.getItem("STRAVA_ACCESS_TOKEN")).then(res =>
      {athleteLatestActivity = res.data[0]});
      console.log(athleteLatestActivity);
    }

    const GetPolyline = () =>{
        axios.get(activitiesURL + localStorage.getItem("STRAVA_ACCESS_TOKEN")).then(res =>
          {setLine(decodePolyline(res.data[0].map.summary_polyline))})
      }
    
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyC-q4IU6h7qcun4XGA95hu_84YN0VuwmHQ"
    })

    const onLoad = polyline => {
        console.log('polyline: ', polyline)
    };

    return isLoaded ? (
        <div>
            <Card mt={3} sx={{ maxWidth: 345 }}>
      <CardActionArea>
      <GoogleMap
        id="marker-example"
        mapContainerStyle={containerStyle}
        zoom={15}
        center={line[(line.length-1) / 2]}
        >
        <Polyline
            onLoad={onLoad}
            path={line}
            options={options}
        />
        </GoogleMap>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Your most recent walk
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This is an overview of your most recent walk made on this app.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
        </div>
        
    ) : <SendRequest/>
}

React.memo(Maps)
