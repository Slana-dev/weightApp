import moment from 'moment';
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Keyboard, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const darkBlue = "rgb(30,38,68)";
const lightblueColor = "rgb(44, 57,103)";
const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const gainColor = "lightgreen";

export default function WeightScreen() {

    const [today] = useState(moment());
    const [startOfWeek] = useState(today.clone().startOf('isoWeek'));
    const [selectedDate, setSelectedDate] = useState(today.format('YYYY-MM-DD'));
    const [selectedDateDay, setSelectedDateDay] = useState(today.format('DD'));
    const [selectedDateLabel, setSelectedDateLabel] = useState(today.format('ddd'));
    const [weightsByDate, setWeightsByDate] = useState({});
    const [weightPopup, setWeightPopupVisible] = useState(false);
    const [weightInput, setWeightInput] = useState("");
    const [weekAvg, setWeekAvg] = useState(0);
    const slideAnim = useRef(new Animated.Value(1300)).current;

    // Removed <TextInput> type annotation
    const inputRef = useRef(null);


    const days = Array.from({ length: 7 }, (_, i) => {
        const d = startOfWeek.clone().add(i, 'days');
        return {
            label: d.format('ddd'),
            date: d.format('YYYY-MM-DD'),
            dayNumber: d.format('D'),
        };
    });

    const loadWeights = async () => {
        const res = await getWeight(
            startOfWeek.format("YYYY-MM-DD"),
            today.format("YYYY-MM-DD")
        );
        const map = {};
        days.forEach((d, index) => {
            map[d.date] = res.data[index];
        });
        calculateWeekAvg()
        setWeightsByDate(map);

    };
    useEffect(() => {
        loadWeights();
    }, [startOfWeek, today]);

    const changeWeight = (date, dateLabel, dateDay) => {
        setSelectedDate(date);
        setSelectedDateDay(dateDay);
        setSelectedDateLabel(dateLabel);
        setWeightPopupVisible(true);
        slideIn();
    };

    useEffect(() => {
        if (weightPopup) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [weightPopup]);

    const slideIn = () => {
        Animated.timing(slideAnim, {
            toValue: 295,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setWeightPopupVisible(true));
    };

    const slideOut = () => {
        Keyboard.dismiss();
        Animated.timing(slideAnim, {
            toValue: 1000,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setWeightPopupVisible(false));
    };
    const calculateWeekAvg = () => {
        let n = 0;
        let sum = 0;
        days.forEach((d) => {
            if (weightsByDate[d.date] != -1) {
                n += 1;
                sum += Number(weightsByDate[d.date]);
            }
        });
        console.log(n);
        console.log(sum);
        if (n == 0) {
            setWeekAvg(0);
            return;
        }
        setWeekAvg(Math.round((sum / n) * 10) / 10);

    }
    const submitWeight = async () => {
        slideOut();
        setWeightInput(-1);
        weightsByDate[selectedDate] = weightInput;
        calculateWeekAvg();
        const response = await fetch(`http://192.168.68.105:5500/api/weights/add-weight`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                weightKg: parseFloat(weightInput),
                date: selectedDate
            }),

        })

        console.log(response.status);
        return;
    };

    const getWeight = async (start, end) => {
        const response = await fetch(
            `http://192.168.68.105:5500/api/weights/get-weight?startDate=${start}&endDate=${end}`
        );

        if (!response.ok) throw new Error("Failed to fetch weights");
        return response.json();
    };





    return (

        <View style={styles.container}>
            <Modal
                visible={weightPopup}
                transparent={true}
                animationType="none"
                onRequestClose={() => {
                    slideOut();
                }}>
                {weightPopup && (
                    <Animated.View style={[styles.popup, { transform: [{ translateY: slideAnim }] }]}>
                        <View style={{ backgroundColor: "darkgrey", width: 140, alignItems: "center", borderRadius: 10 }}>
                            <Text style={[styles.subtitle, { fontSize: 20 }]}>{selectedDateLabel} {selectedDateDay}th </Text>
                        </View>
                        <View style={{ backgroundColor: "grey", width: 140, alignItems: "center" }}>
                            <TextInput
                                ref={inputRef}
                                style={styles.input}
                                placeholderTextColor="grey"
                                keyboardType="number-pad"
                                returnKeyType="next"
                                onChangeText={value => {
                                    setWeightInput(value);
                                }}
                            />
                        </View>
                        <View style={{ backgroundColor: "grey", width: 150, flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 13 }}>
                            <View style={{ backgroundColor: "grey", width: 70, alignItems: "center" }}>
                                <Pressable onPress={slideOut}>
                                    <Text style={[styles.subtitle, { fontSize: 17 }]}>Cancel</Text>
                                </Pressable>
                            </View>
                            <View style={{ backgroundColor: "grey" }}>
                                <Pressable onPress={submitWeight}>
                                    <Text style={[styles.subtitle, { fontSize: 17, color: gainColor }]}>Save</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Animated.View>
                )}
            </Modal>

            <View style={styles.titleContainer}>
                <Text style={styles.title}>Weight</Text>
            </View>

            <View style={[styles.avgContainer, { height: 90, alignItems: "flex-end" }]}>
                <View style={[styles.singleTextContainer, { height: 40, width: 150, backgroundColor: lightblueColor, justifyContent: "flex-end", alignItems: "flex-end" }]}>
                    <Pressable style={{ alignSelf: "flex-start", justifyContent: "center" }}>
                        {({ pressed }) => (
                            <Text style={[styles.subtitle, { color: !pressed ? "white" : "grey" }]}>See All</Text>
                        )}
                    </Pressable>
                </View>

                <View style={[styles.singleTextContainer, { height: 40, backgroundColor: lightblueColor, paddingRight: 15, flexDirection: "row", width: 200, justifyContent: "space-between", alignItems: "flex-end" }]}>
                    <View>
                        <Text style={styles.subtitle}>Week avg: </Text>
                    </View>
                    <Text style={[styles.subtitle, { color: "lightgrey", fontSize: 25 }]}>{weekAvg} </Text>
                    <Text style={[styles.subtitle, { fontSize: 15, color: gainColor }]}>(0.01)</Text>
                </View>
            </View>

            <View style={styles.weekRow}>

                {days.map((d) => (
                    <TouchableOpacity
                        key={d.date}
                        style={[
                            styles.day,
                            d.date === selectedDate && styles.selectedDay,
                            d.date === today.format('YYYY-MM-DD') && styles.todayDay,
                        ]}
                        onPress={() => changeWeight(d.date, d.label, d.dayNumber)}
                    >
                        <Text style={styles.weightFont}>{d.label}</Text>
                        <Text style={styles.number}>{d.dayNumber}</Text>
                        <Text style={[styles.weightFont, { color: "black" }]}>{weightsByDate[d.date] != -1 ? weightsByDate[d.date] + 'kg' : ''}</Text>
                    </TouchableOpacity>
                ))}
            </View>


            <View style={styles.titleContainer}>
                <Text style={styles.title}>graph</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: lightblueColor,
    },
    weekRow: {
        height: 150,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: lightblueColor,
    },
    day: {
        alignItems: 'center',
        width: 50,
        height: 80,
        //borderRadius: 8,
        paddingTop: 5,
        backgroundColor: "white",
    },
    selectedDay: {
        backgroundColor: 'white',
    },
    input: {
        color: "white",
        height: 45,
        width: 80,
        fontSize: 20,
        margin: 0
    },
    todayDay: {
        backgroundColor: gainColor,
    },
    number: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    title: {
        fontSize: 32,
        color: "white",
        fontWeight: "bold",
        position: "relative",
    },
    popup: {
        height: 110,
        width: 190,
        alignSelf: "center",
        backgroundColor: "grey",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 35,
        paddingBottom: 30,
        borderWidth: 2,
        borderColor: "grey",
        borderRadius: 10,
    },
    titleContainer: {
        height: height * 0.12,
        backgroundColor: darkBlue,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
        paddingHorizontal: 30,
        paddingBottom: 10,
        paddingTop: height * 0.03,
    },
    avgContainer: {
        height: height * 0.12,
        backgroundColor: lightblueColor,
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 10,
        paddingTop: height * 0.01,
    },
    singleTextContainer: {
        height: 55,
        backgroundColor: lightblueColor,
        width: 150,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    subtitle: {
        fontWeight: "bold",
        fontSize: 20,
        color: "white"
    },
    weightFont: {
        fontSize: 13,
        color: "grey",
        fontWeight: "500"
    },
    weightContainer: {
        height: 60,
        backgroundColor: lightblueColor,
        width: 150,
        paddingTop: 8,
        flexDirection: "column",
        alignItems: "center",
        borderWidth: 2.5,
        borderColor: darkBlue,
        borderRightWidth: 0,
    },
});