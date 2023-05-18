import React, { useState, useRef } from 'react';
import { View, Modal, Pressable, Button, Text, StyleSheet } from 'react-native';

const Legend = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const ref = useRef(null);

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  return (
    <>
      <Button ref={ref} onPress={handlePress} title="Legend" />
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={handleClose}
        transparent={true}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.legendContainer}>
            <View style={modalStyles.legendItem}>
              <View
                style={[modalStyles.legendIcon, modalStyles['triple-word']]}
              />
              <Text style={modalStyles.legendText}>Triple Word Score</Text>
            </View>
            <View style={modalStyles.legendItem}>
              <View
                style={[modalStyles.legendIcon, modalStyles['double-word']]}
              />
              <Text style={modalStyles.legendText}>Double Word Score</Text>
            </View>
            <View style={modalStyles.legendItem}>
              <View
                style={[modalStyles.legendIcon, modalStyles['triple-letter']]}
              />
              <Text style={modalStyles.legendText}>Triple Letter Score</Text>
            </View>
            <View style={modalStyles.legendItem}>
              <View
                style={[modalStyles.legendIcon, modalStyles['double-letter']]}
              />
              <Text style={modalStyles.legendText}>Double Letter Score</Text>
            </View>
            <Pressable onPress={handleClose} style={modalStyles.confirmButton}>
              <Text style={{ fontSize: 24, color: 'white' }}>Okay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Legend;

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    width: 300,
    height: 400,
    backgroundColor: 'white',
    padding: 16,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'black',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    gap: 10,
  },
  legendIcon: {
    width: 30,
    aspectRatio: '1 / 1',
    borderRadius: 15,
  },
  'triple-word': {
    backgroundColor: 'red',
  },
  'double-word': {
    backgroundColor: 'pink',
  },
  'triple-letter': {
    backgroundColor: 'blue',
  },
  'double-letter': {
    backgroundColor: 'lightblue',
  },
  legendText: {
    fontSize: 20,
  },
  confirmButton: {
    marginTop: 'auto',
    textAlign: 'center',
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 8,
    padding: 4,
    backgroundColor: 'rgb(39, 82, 255)',
  },
});
