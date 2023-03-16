import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {ICON_MAP} from '../utils/iconmap';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

const DailyWeather = ({route, navigation}) => {
  const {data, city} = route.params;

  const getDay = timestamp => {
    let date = moment.unix(timestamp);
    return date.format('dddd');
  };

  const getDetails = timestamp => {
    const elements = [];

    for (let i = 0; i < 7; i++) {
      const jsx = (
        <View key={i} style={styles.singleDay}>
          <View style={[styles.days]}>
            <Text style={[styles.tableText]}>{getDay(data.daily.time[i])}</Text>
          </View>
          <View style={[styles.temp]}>
            <View style={[styles.tempMax]}>
              <Text style={[styles.tableText]}>
                {data.daily.temperature_2m_max[i]} °
              </Text>
            </View>
            <View style={[styles.tempMin]}>
              <Text style={[styles.tableText]}>
                {data.daily.temperature_2m_min[i]} °
              </Text>
            </View>
          </View>
          <View style={[styles.icons]}>
            <IconMaterialCommunity
              name={ICON_MAP.get(data.daily.weathercode[i])}
              size={30}
              color="#900"
            />
          </View>
        </View>
      );
      elements.push(jsx);
    }

    return elements;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header]}>
        <IconIonicons
          name="chevron-back"
          size={30}
          color="#F5F5F5"
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.textColor, styles.locationText]}>{city}</Text>
      </View>
      <Text style={[styles.textColor, styles.subTitle]}>Next Week</Text>
      <View style={[styles.tableContainer]}>{getDetails()}</View>
    </View>
  );
};

export default DailyWeather;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    height: '100%',
    padding: 12,
  },
  textColor: {
    color: '#f5f5f5',
  },
  tableText: {
    color: '#f5f5f5',
    fontSize: 18,
  },
  locationText: {
    fontSize: 24,
    textAlign: 'center',
    marginHorizontal: 95,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    marginBottom: 24,
  },
  subTitle: {
    fontSize: 24,
    marginBottom: 42,
    textAlign: 'center',
  },
  tableContainer: {
    paddingHorizontal: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: 500,
  },
  singleDay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  days: {
    width: '30%',
  },
  temp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '50%',
    columnGap: 20,
  },
  tempMax: {},
  tempMin: {},
  icons: {
    width: '20%',
    alignItems: 'flex-end',
  },
});
