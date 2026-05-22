import * as MediaLibrary from 'expo-media-library'


export async function requestMediaPermissions() : Promise<boolean> {
    const {status , canAskAgain } = await MediaLibrary.getPermissionsAsync();
    if(status === "granted"){
        return true;
    }
    if(canAskAgain){
        const {status : requestStatus} = await MediaLibrary.requestPermissionsAsync();
        return requestStatus === "granted";
    }
    return false;
}