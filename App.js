import { StatusBar } from 'react-native';
import { StyleSheet, Text, View, SafeAreaView, Platform } from 'react-native';
import { useState, useEffect } from 'react';

import CurrentPrice from './src/components/CurrentPrice';
import HistoryGraphic from './src/components/HistoryGraphic';
import QuotationsList from './src/components/QuotationsList';


function addZero(number) {

    if (number <= 9) {
        return "0"+ number;
    }

    return number;
}

function url(qtdDays){
    const date = new Date();
    const listLastDays = qtdDays;
    const endtDate = `${date.getFullYear()}-${addZero(date.getMonth()+1)}-${addZero(date.getDate())}`;

    date.setDate(date.getDate() - listLastDays)

    const startDate = `${date.getFullYear()}-${addZero(date.getMonth()+1)}-${addZero(date.getDate())}`;

    return `https://api.coindesk.com/v1/bpi/historical/close.json?start=${startDate}&end=${endtDate}`;
}

async function getPriceCoinsGraphic(url) {

    let responseG = await fetch(url);
    let returnApiG = await responseG.json()
    let selectListQuotG = returnApiG.bpi

    const queryCoinsListG = Object.keys(selectListQuotG).map((key) => {
        return key = selectListQuotG[key]
    });

    let dataG = queryCoinsListG;
    return dataG;
}

async function getList(url) {
    let response = await fetch(url);
    let returnApi = await response.json()
    let selectListQuot = returnApi.bpi

    const queryCoinsList = Object.keys(selectListQuot).map((key) => {
        return {
            data: key.split("-").reverse().join("/"),
            valor: selectListQuot[key],
        }
    });

    let data = queryCoinsList.reverse();
    return data;
}

export default function App() {

    const [coinsList, setCoinList] = useState([])
    const [lastQuote, setLastQuote] = useState(null)
    const [ coinsGraphictList, setCoinsGraphictList ] = useState([0]);
    const [days, setDays] = useState(30)
    const [updateData, setUpdateData] = useState(true)

    function updateDay(number) {
        setDays(number);
        setUpdateData(true);
    }

    useEffect(() => {
        getList(url(days)).then((data) => {
            setCoinList(data)
        });

        getPriceCoinsGraphic(url(days)).then((dataG) => {
            setCoinsGraphictList(dataG)
            setLastQuote(dataG[dataG.length - 1])
        })

        if (updateData) {
            setUpdateData(false);
        }

    }, [updateData]);
  
    return (
  
        <SafeAreaView style={styles.container}>
            <StatusBar 
                backgroundColor='#f50d41'
                barStyle="light-content"
            style="auto" />

            <CurrentPrice lastQuote={lastQuote} />
            <HistoryGraphic infoDataGraphic={coinsGraphictList} />
           
            <QuotationsList filterDay={updateDay} listTransactions={coinsList} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        alignItems: 'center',
        paddingTop: Platform.OS === "android" ? 40 : 0,
    },
});
