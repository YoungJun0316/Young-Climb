import React from 'react';
import {View, Text} from 'react-native';
import CustomSubHeader from '../../components/CustomSubHeader';

function PostScreen({navigation}) {
  return (
    <View>
      <CustomSubHeader title="댓글" navigation={navigation} />
      <Text>게시글</Text>
    </View>
  );
}

export default PostScreen;