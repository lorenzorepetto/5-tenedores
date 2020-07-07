import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from "react-native-elements";
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export default function UserInfo( props ) {
    const { 
        userInfo : { uid, photoURL, displayName, email },
        toastRef,
        setLoading,
        setLoadingText 
    } = props;

    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;

        if (resultPermissionCamera === 'denied') {
            toastRef.current.show("Es necesario aceptar los permisos de la galería");
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })
            if (result.cancelled) {
                toastRef.current.show("Haz cerrado la selección de imágen");
            } else {
                uploadImage(result.uri).then(() => {
                    updatePhotoUrl();
                })
                .catch(() => {
                    toastRef.current.show("Error al subir la foto");
                });
            }
        }
    }

    const uploadImage = async(uri) => {
        setLoadingText("Actualizando Avatar");
        setLoading(true);

        const response = await fetch(uri);
        const blob = await fetch(response.blob());
        
        const ref = firebase.storage().ref().child(`avatar/${ uid }`);
        return ref.put(blob);
    }

    const updatePhotoUrl = () => {
        firebase
            .storage()
            .ref(`avatar/${ uid }`)
            .getDownloadURL()
            .then(async(response) => {
                const update = {
                    photoURL: response
                };
                await firebase.auth().currentUser.updateProfile(update);
            })
            .catch(() => {
                toastRef.current.show("Error al subir la foto");
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <View style={styles.viewUserInfo}>
            <Avatar 
                rounded
                size="large"
                showEditButton
                onEditPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}
                source={
                    photoURL 
                    ? { uri: photoURL }
                    : require("../../../assets/img/default-avatar.jpg")
                }
            />
            <View>
                <Text style={styles.displayName}>
                    { displayName ? displayName : "Anónimo" }
                </Text>
                <Text>
                    { email ? email : "Social Login" }
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar: {
        marginRight: 20
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5,
    }
})
