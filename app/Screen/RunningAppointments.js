import { StyleSheet, Text,ToastAndroid,ScrollView } from 'react-native'
import React,{useEffect,useState} from 'react'
import Screen from '../Components/Screen'
import Firebase from '../config/firebase'
import useAuth from '../auth/useAuth';
import RunningAppointMentCard from '../Components/RunningAppointmentCard';
import ActivityIndicator from '../Components/ActivityIndicator';
import dateFormat from 'dateformat';

export default function RunningAppointments() {
  const [loading,setLoading] = useState(false);
  const db = Firebase.firestore();
  const [RunningAppointments,setRunningAppointments] = useState([]);
  const {userData} = useAuth();

  const HandleCheck = async (name,email,disease,phone_no,id) => {
    const userRef = Firebase.firestore().collection('AppUsers').doc(userData.id).collection('Appointments_History');
    try {
      await userRef.add({
        name,email,disease,contact_no:phone_no,date: dateFormat(new Date(),"mmmm dS, yyyy").toString()
      }).then(data => {
        ToastAndroid.show("Your Appoinments is Done!",ToastAndroid.SHORT);
      })
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Something Went  Wrong!",ToastAndroid.SHORT)
    }
    try {
      await Firebase.firestore().collection('AppUsers').doc(userData.id).collection('RunningAppointments').doc(id).delete();
     } catch (error) {
       console.log(error);
       ToastAndroid.show("Something Went  Wrong!",ToastAndroid.SHORT);
     }
  }


  useEffect(() => {
    setLoading(true);
    db.collection('AppUsers').doc(userData.id).collection('RunningAppointments').onSnapshot(snapshot => {
      setRunningAppointments(snapshot.docs.map(
          doc => (
              {
              id:doc.id,
              contact_no:doc.data().Contact_No,
              disease:doc.data().disease,
              email:doc.data().email,
              name:doc.data().name,
              Address:doc.data().Address,
              date : doc.data().date
          })))
  });
setLoading(false);
  },[])

  return (
    <>
    <ActivityIndicator visible={loading}/>
  <Screen>
    <ScrollView>
     {
        RunningAppointments.length ?

       RunningAppointments.map(data =>  {
  

         return (
          <RunningAppointMentCard
          disease={data.disease}
          email={data.email}
          name={data.name}
          phone_no={data.contact_no}
          id={data.id}
          key={data.id}
          HandleCheck={() =>  HandleCheck(data.name,data.email,data.disease,data.contact_no,data.id)}
         />
         )
       }) :
       
         <Text style={styles.text}> ( ????????? ??????????????????????????? ???????????????????????? ???????????? ?????????????????????????????? ????????? ???????????? ????????????! )</Text>

      }
     </ScrollView>
  </Screen>
    </>
  )
}

const styles = StyleSheet.create({
  text :{
    width:300,
    fontSize : 20,
    textAlign:'center',
    alignSelf:'center'
  },
 
  
})