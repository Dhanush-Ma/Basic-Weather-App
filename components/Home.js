import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {
  PermissionsAndroid,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
} from 'react-native';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from '@react-native-community/geolocation';

import IconFeather from 'react-native-vector-icons/Feather';
import {ICON_MAP} from '../utils/iconmap';
import {NAME_MAP} from '../utils/namemap';

function Home({navigation}) {
  const getCurrentDay = () => {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return `${new Date().getDate()} ${monthNames[new Date().getMonth()]}`;
  };

  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [city, setCity] = useState('');
  const isDarkMode = useColorScheme() === 'dark';
  const [result, setResult] = useState(null);
  const [currentDay, setCurrentDay] = useState(getCurrentDay());
  const [currentWeatherDetails, setCurrentWeatherDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const getPreciptation = data => {
    let currentDay = new Date().getDate();

    let preciptation = 0;

    let elements = data.hourly.time.map((item, index) => {
      let date = moment.unix(item);
      if (date.format('D') == currentDay) {
        preciptation += Number(data.hourly.precipitation_probability[index]);
        return item;
      }
    });
    elements = elements.filter(element => element != null);
    const result = preciptation / elements.length;

    return Math.round(result);
  };

  const getHourlyWeather = () => {
    let currentDay = new Date().getDate();

    if (!result) {
      return;
    }

    let elements = result.hourly.time.map((item, index) => {
      let date = moment.unix(item);
      if (date.format('D') == currentDay) {
        return (
          <View key={index} style={styles.card}>
            {result && (
              <Text style={styles.cardText}>{date.format('h:mm A')}</Text>
            )}
            <IconMaterialCommunity
              name={ICON_MAP.get(result.hourly.weathercode[index])}
              size={30}
              color="#f5f5f5"
            />
            {result && (
              <Text style={styles.cardWeather}>
                {result.hourly.temperature_2m[index]} °
              </Text>
            )}
          </View>
        );
      }
    });
    elements = elements.filter(element => element != null);
    return elements;
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          getOneTimeLocation();
          subscribeLocationLocation();
        } else {
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);
  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        getWeatherInfo(
          JSON.stringify(position.coords.latitude),
          JSON.stringify(position.coords.longitude),
        );
        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
      },
      error => {},
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      position => {
        //Will give you the location on location change

        console.log(position);

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      },
      error => {},
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
  };

  function getWeatherInfo(lat, long) {
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,weathercode,precipitation_probability&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&current_weather=true&timeformat=unixtime&timezone=Asia%2FKolkata`,
    )
      .then(res => res.json())
      .then(data => {
        setResult(data);
        setCurrentWeatherDetails({
          temperature: data.current_weather.temperature,
          windSpeed: data.current_weather.windspeed,
          weatherCode: data.current_weather.weathercode,
          precipitation: getPreciptation(data),
        });
        setLoading(false);
      })
      .catch(err => console.log(err));

    fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`,
    )
      .then(res => res.json())
      .then(data => {
        console.log(data.city);
        setCity(data.city);
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    if (!currentLatitude && !currentLongitude) return;
  }, [currentLatitude, currentLongitude]);

  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#121212"
      />
      {!loading ? (
        <ScrollView style={styles.containerView}>
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <View style={styles.location}>
                <IconMaterial name="location-pin" size={30} color="#900" />
                <Text style={styles.locationText}>{city}</Text>
              </View>
              <IconFeather
                name="calendar"
                size={30}
                color="#900"
                onPress={() =>
                  navigation.navigate('DailyWeather', {
                    data: result,
                    city,
                  })
                }
              />
            </View>

            <View style={styles.weatherInfoContainer}>
              <IconMaterialCommunity
                name={ICON_MAP.get(currentWeatherDetails.weatherCode)}
                size={200}
                color="#900"
              />
              <Text style={styles.weatherText}>
                {NAME_MAP.get(currentWeatherDetails.weatherCode)}
              </Text>
              <Text style={styles.weatherNumber}>
                {currentWeatherDetails.temperature}°
              </Text>
              <View style={styles.weatherDetailsContainer}>
                <View style={styles.weatherDetails}>
                  <IconFeather name="wind" size={30} color="#900" />
                  <Text>{currentWeatherDetails.windSpeed}km/h</Text>
                </View>
                <View style={styles.weatherDetails}>
                  <IconFeather name="droplet" size={30} color="#900" />
                  <Text>{currentWeatherDetails.precipitation}%</Text>
                </View>
              </View>
            </View>
            <View style={styles.cardContainer}>
              <Text style={styles.cardMainText}>Today, {currentDay}</Text>
              <ScrollView horizontal={true}>
                {!!result && getHourlyWeather()}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={[styles.loaderContainer]}>
          <ActivityIndicator size="large" color="#14d549" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerView: {
    backgroundColor: '#121212',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  loaderContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  location: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 24,
    color: '#f5f5f5',
  },

  weatherInfoContainer: {
    marginTop: 20,
    marginBottom: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'stretch',
  },
  weatherText: {
    textAlign: 'center',
    fontSize: 28,
  },
  weatherNumber: {
    textAlign: 'center',
    fontSize: 28,
    marginVertical: 12,
  },
  weatherDetailsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  weatherDetails: {
    flex: 1,
    alignItems: 'center',
    gap: 12,
  },
  cardContainer: {
    width: '100%',
  },
  cardMainText: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 20,
  },
  card: {
    width: 100,
    height: 140,
    backgroundColor: '#454545',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginRight: 16,
  },
  cardText: {},
  cardWeather: {},
});

export default Home;
