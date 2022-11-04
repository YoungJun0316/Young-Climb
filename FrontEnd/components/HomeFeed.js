/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Video from 'react-native-video';

import UserAvatar from './UserAvatar';
import HoldLabel from './HoldLabel';
import LevelLabel from './LevelLabel';

import avatar from '../assets/image/initial/background.png';
import MenuIcon from '../assets/image/feed/menuIcon.svg';
import CameraIcon from '../assets/image/feed/whiteCamera.svg';
import EmptyHeart from '../assets/image/feed/emptyHeart.svg';
import FillHeart from '../assets/image/feed/fillHeart.svg';
import EmptyScrap from '../assets/image/feed/emptyScrap.svg';
import FillScrap from '../assets/image/feed/fillScrap.svg';
import EyeIcon from '../assets/image/feed/eye.svg';
import HoldIcon from '../assets/image/hold/hold.svg';

import {YCLevelColorDict} from '../assets/info/ColorInfo';

function HomeFeed({feed, navigation, isViewable}) {
  const [contentHeight, setContentHeight] = useState(0);
  const [videoLength, setVideoLength] = useState(0);
  const [isFullContent, setIsFullContent] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      return () => setIsMuted(true);
    }, []),
  );

  const onLayout = e => {
    const {height} = e.nativeEvent.layout;
    setContentHeight(height);
  };

  const calVideoLength = e => {
    const {width} = e.nativeEvent.layout;
    setVideoLength(width);
  };

  const viewFullContent = () => {
    setIsFullContent(true);
  };

  const changeMuted = () => {
    setIsMuted(!isMuted);
  };

  return (
    <View style={styles.container} onLayout={calVideoLength}>
      {/* 피드 상단 헤더 */}
      <View style={styles.feedHeader}>
        <View style={styles.headerTop}>
          <View style={styles.iconText}>
            <UserAvatar source={avatar} size={36} />
            <View style={styles.headerTextGroup}>
              <View style={{...styles.iconText, alignItems: 'center'}}>
                <Text
                  style={{
                    ...styles.feedTextStyle,
                    fontSize: 16,
                    fontWeight: '600',
                    marginRight: 5,
                  }}>
                  {feed.createUser.nickname}
                </Text>
                <HoldIcon
                  width={18}
                  height={18}
                  color={YCLevelColorDict[feed.createUser.rank]}
                />
              </View>
              <Text style={{...styles.feedTextStyle, fontSize: 12}}>
                {feed.createdAt}
              </Text>
            </View>
          </View>
          <MenuIcon width={16} height={16} />
        </View>
        <View style={styles.wallInfo}>
          <Text style={{...styles.feedTextStyle, marginRight: 8}}>
            {feed.centerName}
          </Text>
          {feed.wallName ? (
            <Text style={{...styles.feedTextStyle, marginRight: 8}}>
              {feed.wallName}
            </Text>
          ) : null}
          <Text style={{...styles.feedTextStyle, marginRight: 3}}>
            {feed.difficulty}
          </Text>
          <LevelLabel color={feed.centerLevelColor} />
          <HoldLabel color={feed.holdColor} />
        </View>
      </View>
      {/* 동영상 */}
      <View style={{width: videoLength, height: videoLength}}>
        <TouchableOpacity
          style={styles.videoBox}
          activeOpacity={1}
          onPress={changeMuted}>
          <Video
            source={{uri: feed.mediaId}}
            style={styles.backgroundVideo}
            fullscreen={false}
            resizeMode={'contain'}
            repeat={true}
            controls={false}
            paused={!isViewable}
            muted={isMuted}
          />
        </TouchableOpacity>
        <View style={styles.solvedDate}>
          <CameraIcon />
          <Text
            style={{
              color: 'white',
              fontSize: 12,
              marginLeft: 3,
              marginTop: 1,
            }}>
            {feed.solvedDate}
          </Text>
        </View>
      </View>
      {/* 좋아요, 스크랩, 조회수 */}
      <View style={styles.popularInfo}>
        <View style={styles.likeGroup}>
          <View style={styles.iconText}>
            {feed.isLiked ? (
              <TouchableOpacity onPress={() => null}>
                <FillHeart style={{marginRight: 5}} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => null}>
                <EmptyHeart style={{marginRight: 5}} />
              </TouchableOpacity>
            )}
            <Text style={styles.feedTextStyle}>
              {feed.like} 명이 좋아합니다.
            </Text>
          </View>
          {feed.isScrap ? (
            <TouchableOpacity onPress={() => null}>
              <FillScrap style={{marginRight: 5}} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => null}>
              <EmptyScrap style={{marginRight: 5}} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.iconText}>
          <EyeIcon style={{marginRight: 5}} />
          <Text style={styles.feedTextStyle}>
            {feed.view} 명이 감상했습니다.
          </Text>
        </View>
      </View>
      {/* 본문, 댓글 미리보기, 댓글 수 */}
      <View style={styles.contentSummary}>
        <View
          onLayout={onLayout}
          style={{position: 'absolute', top: 0, opacity: 0}}>
          <Text style={styles.contentPreview}>{feed.content}</Text>
        </View>
        {!isFullContent && contentHeight > 32 ? (
          <TouchableOpacity
            style={styles.viewFullContent}
            onPress={viewFullContent}>
            <Text
              numberOfLines={2}
              ellipsizeMode="clip"
              style={styles.contentPreview}>
              {feed.content}
            </Text>
            <Text style={{color: '#a7a7a7', fontSize: 13}}>... 더 보기</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              navigation ? navigation.navigate('댓글', {board: feed}) : null
            }>
            <Text style={styles.contentPreview}>{feed.content}</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={styles.commentSummary}
        onPress={() =>
          navigation ? navigation.navigate('댓글', {board: feed}) : null
        }>
        <View style={styles.commentPreview}>
          <Text
            style={{
              ...styles.feedTextStyle,
              fontWeight: '600',
              marginRight: 8,
            }}>
            {feed.commentPreview.nickname}
          </Text>
          <Text
            numberOfLines={1}
            style={{...styles.feedTextStyle, width: '60%', overflow: 'hidden'}}>
            {feed.commentPreview.comment}
          </Text>
        </View>
        <Text style={{...styles.feedTextStyle, color: '#a7a7a7'}}>
          댓글 {feed.commentNum}개 모두 보기
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderTopWidth: 0.2,
    borderColor: 'black',
    paddingVertical: 3,
  },
  feedHeader: {
    margin: 8,
  },
  headerTop: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconText: {
    display: 'flex',
    flexDirection: 'row',
  },
  headerTextGroup: {
    marginLeft: 8,
    display: 'flex',
    justifyContent: 'space-between',
  },
  feedTextStyle: {
    color: 'black',
    fontSize: 14,
  },
  wallInfo: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    marginLeft: 5,
  },
  videoBox: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  solvedDate: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    right: 0,
    paddingVertical: 2,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  popularInfo: {
    marginTop: 8,
    marginHorizontal: 8,
  },
  likeGroup: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentSummary: {
    marginVertical: 3,
    marginHorizontal: 10,
  },
  contentPreview: {
    color: 'black',
    fontSize: 14,
    lineHeight: 16,
  },
  viewFullContent: {
    padding: 1,
  },
  commentSummary: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  commentPreview: {
    display: 'flex',
    flexDirection: 'row',
  },
});

export default HomeFeed;