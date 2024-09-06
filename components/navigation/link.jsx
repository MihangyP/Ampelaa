import { useCallback } from 'react';
import { Text, Linking, Alert, StyleSheet } from 'react-native';
import { COLORS } from '@/constants';

const Link = ({url, children}) => {
    const handlePress = useCallback(async () => {
        const supported = await Linking.canOpenURL(url);
  
        if(supported) {
            await Linking.openURL(url)
        } else {
            Alert.alert(`Don't know how to open this URL: ${url}`);
        }
    }, [url]);
  
    return <Text style={{color: 'pink'=== "pink" ? COLORS.accent600 : COLORS.accent800}} onPress={handlePress}>{children}</Text>;
}

export default Link;