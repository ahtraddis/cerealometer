import * as React from "react"
import { useEffect, useState } from "react"
import { Observer } from 'mobx-react-lite'
import { useStores } from "../../models/root-store"
import { MessageSnapshot } from "../../models/message"
import { View, FlatList } from "react-native"
import { Text, Message } from "../../components"
import { EMPTY_MESSAGE, EMPTY_MESSAGE_TEXT } from "../../styles/common"
import { styles } from "./messages.styles"
import database from '@react-native-firebase/database'

/**
 * Display list of user's messages
 */
export const Messages: React.FunctionComponent = (props) => {
  const { userStore, messageStore } = useStores()
  const [refreshing, setRefreshing] = useState(false)

  function onMessagesChange(snapshot: MessageSnapshot[]) {
    messageStore.updateMessages(snapshot)
  }

  useEffect(() => {
    let messageRef
    if (userStore.user.isLoggedIn) {
      let uid = userStore.user.uid
      messageRef = database().ref(`/messages/${uid}`)
      messageRef.on('value', onMessagesChange);
      //messageStore.getMessages(uid)
    }
    return () => {
      if (messageRef) {
        messageRef.off('value', onMessagesChange)
      }
    }
  }, []);

  const onRefresh = async() => {
    __DEV__ && console.tron.log("onRefresh()")    
    if (userStore.user.isLoggedIn) {
      let uid = userStore.user.uid
      setRefreshing(true)
      await messageStore.getMessages(uid)
      setRefreshing(false)
    }
  }

  const renderMessage = ({ item }) => {
    return (
      <Message {...item} />
    )
  }

  const EmptyMessage = () => {
    return (
      <View>
        <View style={EMPTY_MESSAGE}>
          <View>
            <Text tx={"messages.emptyLabel"} style={EMPTY_MESSAGE_TEXT} />
          </View>
        </View>
      </View>
    )
  }
  return (
    <View style={styles.container}>
      { false && (messageStore.messages.length > 0) &&
        <View style={styles.messageCount}>
          <Text tx={"messages.messageCountLabel"} txOptions={{count: messageStore.messages.length}} />
        </View>
      }
      <Observer>{ () =>
        <FlatList
          onRefresh={onRefresh}
          refreshing={refreshing}
          data={messageStore.messages}
          renderItem={renderMessage}
          ListEmptyComponent={EmptyMessage}
          extraData={{ extraDataForMobX: messageStore.messages.length > 0 ? messageStore.messages[0] : "" }}
          keyExtractor={message => message.id}
        />
      }
      </Observer>
    </View>
  )
}