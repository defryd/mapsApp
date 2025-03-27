import { Children, PropsWithChildren, useEffect } from 'react'
import { AppState } from 'react-native'
import { usePermissionStore } from '../store/permissions/usePermissionStore'
import { useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

export const PermissionsChecker = ({ children }: PropsWithChildren) => {

    const { locationStatus, checkLocationPermission } = usePermissionStore();
    const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

    useEffect(() => {
        if (locationStatus === 'granted') {
            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MapScreen' }]
                });
            }
                , 1000);
        } else if (locationStatus !== 'undetermined') {
            navigation.reset({
                index: 0,
                routes: [{ name: 'PermissionsScreen' }]
            });
        }
    }, [locationStatus])

    useEffect(() => {
        checkLocationPermission();
    }, [])
    

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppstate) => {
            if (nextAppstate === 'active') {
                checkLocationPermission();
            }
        })

        return () => {
            subscription.remove();
        }
    }, [])


    return (
        <>
            { children }
        </>
    )
}