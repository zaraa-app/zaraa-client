import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';

const LeaderboardItem = ({ rank, name, initials, score }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.rank}>{rank}th</Text>
            <View style={styles.profile}>
                <View style={styles.avatar}>
                    <Text style={styles.initials}>{initials}</Text>
                </View>
                <Text style={styles.name}>{name}</Text>
            </View>
            <Text style={styles.score}>{score}</Text>
        </View>
    );
};

const Leaderboard = () => {
    // Dummy leaderboard data (unsorted initially)
    const [users] = useState([
        { id: '1', name: 'Yazan Kiswani', score: 1723 },
        { id: '2', name: 'John Doe', score: 1650 },
        { id: '3', name: 'Jane Smith', score: 1590 },
        { id: '4', name: 'Alice Johnson', score: 1540 },
        { id: '5', name: 'Bob Williams', score: 1490 },
    ]);

    // Sort users by highest score (descending order)
    const sortedUsers = [...users].sort((a, b) => b.score - a.score);

    return (
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.listContainer}>
                <FlatList
                    data={sortedUsers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <LeaderboardItem
                            rank={index + 1}
                            name={item.name}
                            initials={item.name.split(' ').map((n) => n[0]).join('')}
                            score={item.score}
                        />
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    listContainer: {
        width: '90%',
        maxWidth: 400,
        alignSelf: 'center',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F5F1EC',
        padding: 12,
        borderRadius: 12,
        marginVertical: 5,
    },
    rank: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4D4D4D',
    },
    profile: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E6F4E6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    initials: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6ABF4B',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#222222',
    },
    score: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6ABF4B',
    },
});

export default Leaderboard;
