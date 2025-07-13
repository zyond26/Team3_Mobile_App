import React, { JSX, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Linking,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Modal,
  Pressable,
} from 'react-native';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { Audio } from 'expo-av';
import { router } from 'expo-router';
import RippleEffect from '@/components/RippleEffect';

const teamMembers = [
  {
    id: 1,
    name: 'Nguyễn Thị Diệu',
    role: 'Project Manager',
    email: 'dieupvn345@gmail.com',
    phone: '0123 456 789',
    github: 'https://github.com/dieupvn',
    linkedin: 'https://linkedin.com/in/dieupvn',
    instagram: 'https://instagram.com/dieupvn',
    skills: ['github', 'trello'],
    color: 'rgb(46, 239, 171)',
    avatar: require('../assets/images/Dieu.jpg'),
  },
  {
    id: 2,
    name: 'Đỗ Lâm Trang',
    role: 'Frontend Developer',
    email: 'tranglam17115@gmail.com',
    phone: '0987 654 321',
    github: 'https://github.com/dieupvn',
    linkedin: 'https://linkedin.com/in/dieupvn',
    instagram: 'https://instagram.com/dieupvn',
    skills: ['html5', 'css3', 'react'],
    color: 'rgb(248, 114, 208)',
    avatar: require('../assets/images/Nhi.jpg'),
  },
  {
    id: 3,
    name: 'Nguyễn Dương Sâm',
    role: 'Backend Developer',
    email: 'duonghoangsamet@gmail.com',
    phone: '0912 345 678',
    github: 'https://github.com/dieupvn',
    linkedin: 'https://linkedin.com/in/dieupvn',
    instagram: 'https://instagram.com/dieupvn',
    skills: ['github', 'node-js', 'java', 'python', 'database'],
    color: 'rgb(68, 164, 242)',
    avatar: require('../assets/images/Sam.jpg'),
  },
  {
    id: 4,
    name: 'Lê Hải Bắc',
    role: 'Mobile Developer',
    email: 'lehbac05@gmail.com',
    phone: '0901 234 567',
    github: 'https://github.com/dieupvn',
    linkedin: 'https://linkedin.com/in/dieupvn',
    instagram: 'https://instagram.com/dieupvn',
    skills: ['react', 'android', 'react-native'],
    color: 'rgb(240, 34, 34)',
    avatar: require('../assets/images/avatar.png'),
  },
  {
    id: 5,
    name: 'Nguyễn Hồng Ngọc',
    role: 'Tester',
    email: 'nguyenngocanh2005a@gmail.com',
    phone: '0933 888 999',
    github: 'https://github.com/dieupvn',
    linkedin: 'https://linkedin.com/in/dieupvn',
    instagram: 'https://instagram.com/dieupvn',
    skills: ['bug', 'jira', 'selenium'],
    color: 'rgb(253, 185, 58)',
    avatar: require('../assets/images/Ngoc.png'),
  },
];

const iconMap: Record<string, (color: string) => JSX.Element> = {
  github: (color) => <FontAwesome name="github" size={20} color={color} />,
  trello: (color) => <FontAwesome5 name="trello" size={20} color={color} />,
  html5: (color) => <FontAwesome5 name="html5" size={20} color={color} />,
  css3: (color) => <FontAwesome5 name="css3" size={20} color={color} />,
  react: (color) => <FontAwesome5 name="react" size={20} color={color} />,
  'node-js': (color) => <FontAwesome5 name="node-js" size={20} color={color} />,
  python: (color) => <FontAwesome5 name="python" size={20} color={color} />,
  database: (color) => <MaterialCommunityIcons name="database" size={20} color={color} />,
  java: (color) => <FontAwesome5 name="java" size={20} color={color} />,
  android: (color) => <FontAwesome5 name="android" size={20} color={color} />,
  expo: (color) => <FontAwesome5 name="expo" size={20} color={color} />,
  'react-native': (color) => <FontAwesome5 name="mobile-alt" size={20} color={color} />,
  bug: (color) => <FontAwesome name="bug" size={20} color={color} />,
  jira: (color) => <FontAwesome5 name="jira" size={20} color={color} />,
  selenium: (color) => <MaterialCommunityIcons name="robot" size={20} color={color} />,
};

const AboutUsScreen = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  const playSound = async () => {
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync(require('../assets/sounds/happy-cat.mp3'));
      await sound.playAsync();
    } catch (error) {
      console.error('Lỗi phát âm thanh:', error);
    }
  };

  const handlePressMember = async (member: any) => {
    await playSound();
    setSelectedMember(member);
  };

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const styles = createStyles(isDark);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animatable.View animation="fadeInDown">
        <FontAwesome name="users" size={50} color="#333" style={{backgroundColor: 'white', padding: 15, borderRadius: 10, marginBottom: 20, marginTop: 40,}} />
      </Animatable.View>
      <Animatable.Text animation="fadeInDown" style={styles.title}>
        🌟 Về Chúng Tôi 🌟
      </Animatable.Text>

      <Animatable.Text animation="fadeIn" delay={300} style={styles.description}>
        Chúng tôi là nhóm sinh viên đến từ Đại học CMC, cùng nhau phát triển ứng dụng PriceWise 💡
      </Animatable.Text>

      {teamMembers.map((member, index) => (
        <Animatable.View key={member.id} animation="fadeInUp" delay={index * 150}>
          <TouchableOpacity onPress={() => handlePressMember(member)} style={styles.card}>
            <Animatable.Image
                source={member.avatar}
                animation="pulse"
                duration={2000}
                iterationCount="infinite"
                easing="ease-in-out"
                style={[
                    styles.avatar,
                    {
                    borderColor: member.color,
                    shadowColor: member.color,
                    shadowOpacity: 0.6,
                    shadowOffset: { width: 0, height: 0 },
                    shadowRadius: 8,
                    },
                ]}
            />

            <View style={styles.info}>
              <Text style={styles.name}>{member.name}</Text>
              <Text style={styles.role}>{member.role}</Text>
              {/* <View style={styles.emailRow}>
                <FontAwesome name="envelope" size={16} color={isDark ? '#ccc' : member.color} style={{ marginRight: 6 }} />
                <Text style={[styles.email, { color: member.color }]}>{member.email}</Text>
              </View> */}
            </View>
          </TouchableOpacity>
        </Animatable.View>
        ))}

        {/* Modal thành viên */}
        <Modal visible={!!selectedMember} transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <Animatable.View animation="zoomIn" duration={400} style={styles.modalContent}>
                {/* <Image
                    source={selectedMember?.avatar}
                    style={[styles.modalAvatar, { borderColor: selectedMember?.color }]}
                /> */}
                <View style={{ position: 'relative', marginBottom: 16 }}>
                    <RippleEffect color={selectedMember?.color} />
                    <Image
                        source={selectedMember?.avatar}
                        style={[styles.modalAvatar, { borderColor: selectedMember?.color }]}
                    />
                </View>

                <Text style={styles.modalName}>{selectedMember?.name}</Text>
                <Text style={styles.modalRole}>{selectedMember?.role}</Text>

                <View style={styles.divider} />

               <TouchableOpacity onPress={() => handleEmailPress(selectedMember?.email)} style={styles.modalRow}>
                    <FontAwesome name="envelope" size={16} color={selectedMember?.color} />
                    <Text style={[styles.modalText]}>
                        Email: <Text style={styles.modalLinkText}>{selectedMember?.email}</Text>
                    </Text>
                    </TouchableOpacity>

                    <View style={styles.modalRow}>
                    <FontAwesome name="phone" size={16} color={selectedMember?.color} />
                    <Text style={styles.modalText}>Điện thoại: {selectedMember?.phone}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.socialRow}>
                    {selectedMember?.github && (
                        <TouchableOpacity onPress={() => Linking.openURL(selectedMember.github)} style={styles.iconLink}>
                        <FontAwesome name="github" size={20} color={selectedMember?.color} />
                        <Text style={[styles.modalText, styles.modalLinkText, { marginLeft: 6 }]}>GitHub</Text>
                        </TouchableOpacity>
                    )}
                    {selectedMember?.linkedin && (
                        <TouchableOpacity onPress={() => Linking.openURL(selectedMember.linkedin)} style={styles.iconLink}>
                        <FontAwesome name="linkedin-square" size={20} color={selectedMember?.color} />
                        <Text style={[styles.modalText, styles.modalLinkText, { marginLeft: 6 }]}>LinkedIn</Text>
                        </TouchableOpacity>
                    )}
                    {selectedMember?.instagram && (
                        <TouchableOpacity onPress={() => Linking.openURL(selectedMember.instagram)} style={styles.iconLink}>
                        <FontAwesome name="instagram" size={20} color={selectedMember?.color} />
                        <Text style={[styles.modalText, styles.modalLinkText, { marginLeft: 6 }]}>Instagram</Text>
                        </TouchableOpacity>
                    )}
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.skillIcons}>
                    {selectedMember?.skills?.map((skill, idx) => (
                      <View key={idx} style={{ marginHorizontal: 8, alignItems: 'center' }}>
                        {iconMap[skill]?.(selectedMember.color) || (
                          <FontAwesome name="question" size={20} color={selectedMember.color} />
                        )}
                        <Text style={[styles.modalText, { fontSize: 12, marginTop: 4 }]}>{skill}</Text>
                      </View>
                    ))}
                    </View>
                  <View style={styles.divider} />

                <Pressable
                    onPress={() => setSelectedMember(null)}
                    style={[styles.modalCloseBtn, { backgroundColor: selectedMember?.color }]}
                >
                    <Text style={styles.modalCloseText}>Đóng</Text>
                </Pressable>
                </Animatable.View>
            </View>
        </Modal>
        <Animatable.View animation="fadeInUp" delay={teamMembers.length * 150}>
            <TouchableOpacity onPress={() => router.push('/drawer/profile')} style={styles.closeBtn}>
                <Text style={{ color: 'black', fontSize: 16, fontWeight: 'bold' }}>Quay lại</Text>
            </TouchableOpacity>
        </Animatable.View>
    </ScrollView>
  );
};

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      padding: 26,
      backgroundColor: isDark ? '#121212' : '#fff',
      alignItems: 'center',
      
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#fff' : 'black',
      marginBottom: 12,
    },
    description: {
      fontSize: 16,
      color: isDark ? '#ccc' : '#333',
      textAlign: 'center',
      marginBottom: 24,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1f1f1f' : '#ffffff',
      padding: 16,
      borderRadius: 16,
      marginBottom: 16,
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    avatar: {
      width: 75,
      height: 75,
      borderRadius: 40,
      marginRight: 16,
      borderWidth: 2,
    },
    info: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#fff' : '#222',
    },
    role: {
      fontSize: 14,
      color: isDark ? '#aaa' : '#555',
      marginBottom: 6,
      fontStyle: 'italic',
    },
    emailRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    email: {
      fontSize: 14,
      textDecorationLine: 'underline',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
    backgroundColor: isDark ? '#222' : '#fff',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    },
    modalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    },
    modalText: {
    fontSize: 14,
    color: isDark ? '#ccc' : '#333',
    marginLeft: 8,
    },
    modalLinkText: {
    textDecorationLine: 'underline',
    fontWeight: '500',
    },
    modalAvatar: {
      width: 90,
      height: 90,
      borderRadius: 45,
      marginBottom: 16,
      borderWidth: 2,
    },
    modalName: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDark ? '#fff' : '#333',
    },
    modalRole: {
      fontSize: 16,
      color: isDark ? '#aaa' : '#666',
      marginVertical: 6,
      fontStyle: 'italic',
    },
    modalEmail: {
      fontSize: 14,
      color: '#0077cc',
      textDecorationLine: 'underline',
      marginBottom: 16,
    },
    modalCloseBtn: {
      marginTop: 16,
      paddingVertical: 8,
      paddingHorizontal: 20,
      borderRadius: 10,
    },
    modalCloseText: {
      color: '#fff',
      fontWeight: '600',
    },
    skillIcons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 8,
    },
    socialRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 12,
      gap: 16,
    },
    iconLink: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    divider: {
        height: 1,
        width: '100%',
        backgroundColor: isDark ? '#444' : '#ccc',
        marginVertical: 12,
    },
    closeBtn: {
        backgroundColor: '#FFCC99',
        paddingVertical: 15,
        paddingHorizontal: 70,
        borderRadius: 10,
        marginTop: 16,
        marginBottom: 50,
        color: '#fff',
        fontSize: 16,
    }
  });

export default AboutUsScreen;
