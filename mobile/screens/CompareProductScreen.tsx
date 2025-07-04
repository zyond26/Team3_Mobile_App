import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Linking,
    SafeAreaView,
} from 'react-native';

const productData = [
    {
        platform: 'Shopee',
        logo: require('../assets/images/shopee.png'),
        price: 32990000,
        discount: 2000000,
        discount_percentage: 5.7,
        rating: 4.8,
        review_count: 520,
        shipping_fee: 0,
        estimated_delivery_time: '2-4 ngày',
        is_official: true,
        product_url: 'https://shopee.vn/product-link',
        color: '#fff0f3',
    },
    {
        platform: 'Tiki',
        logo: require('../assets/images/tiki.png'),
        price: 33190000,
        discount: 1500000,
        discount_percentage: 4.3,
        rating: 4.6,
        review_count: 300,
        shipping_fee: 15000,
        estimated_delivery_time: '3-5 ngày',
        is_official: false,
        product_url: 'https://tiki.vn/product-link',
        color: '#e0f7ff',
    },
    {
        platform: 'Lazada',
        logo: require('../assets/images/Lazada.jpg'),
        price: 32800000,
        discount: 2200000,
        discount_percentage: 6.2,
        rating: 4.7,
        review_count: 450,
        shipping_fee: 10000,
        estimated_delivery_time: '1-3 ngày',
        is_official: true,
        product_url: 'https://lazada.vn/product-link',
        color: '#f3f0ff',
    },
];

export default function CompareProductScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff8fc' }}>
            <ScrollView style={styles.container}>
                <Text style={styles.title}>🎀 So sánh iPhone 15 Pro Max trên các sàn</Text>

                {/* Thẻ sản phẩm */}
                <View style={styles.cardContainer}>
                    {productData.map((item, index) => (
                        <View key={index} style={[styles.productCard, { backgroundColor: item.color }]}>
                            <Text style={styles.platformBadge}>{item.platform}</Text>
                            <Image source={require('../assets/images/IP15.jpg')} style={styles.productImage} />
                            <Image source={item.logo} style={styles.platformLogo} />
                            <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
                            <TouchableOpacity
                                style={styles.buyButton}
                                onPress={() => Linking.openURL(item.product_url)}
                            >
                                <Text style={styles.buyButtonText}>🛒 Xem ngay</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* Bảng so sánh */}
                <Text style={styles.sectionTitle}>Bảng so sánh </Text>
                <View style={styles.table}>
                    {/* Hàng tên sàn */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.labelCell}>Tiêu chí</Text>
                        {productData.map((item, i) => (
                            <Text key={i} style={styles.valueCellHeader}>{item.platform}</Text>
                        ))}
                    </View>

                    {/* Các dòng nội dung */}
                    {[
                        [' Giá bán', item => `${item.price.toLocaleString()} đ`],
                        ['Số tiền giảm giá', item => `${item.discount.toLocaleString()} đ`],
                        ['Tỷ lệ % khuyến mãi', item => `${item.discount_percentage}%`],
                        ['Đánh giá', item => `${item.rating}`],
                        ['Tổng lượt đánh giá', item => `${item.review_count}`],
                        ['Phí vận chuyển', item => item.shipping_fee === 0 ? 'Miễn phí' : `${item.shipping_fee.toLocaleString()} đ`],
                        ['Thời gian giao hàng', item => item.estimated_delivery_time],
                        ['Gian hàng chính hãng', item => item.is_official ? '✅' : '❌'],
                    ].map(([label, getValue], idx) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={styles.labelCell}>{label}</Text>
                            {productData.map((item, i) => (
                                <Text key={i} style={styles.valueCell}>
                                    {getValue(item)}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#d63384',
        marginBottom: 20,
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    productCard: {
        width: '30%',
        alignItems: 'center',
        borderRadius: 14,
        padding: 10,
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        elevation: 2,
    },
    platformBadge: {
        backgroundColor: '#ff69b4',
        color: '#fff',
        fontWeight: 'bold',
        paddingVertical: 2,
        paddingHorizontal: 8,
        borderRadius: 10,
        fontSize: 12,
        marginBottom: 6,
    },
    productImage: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
    },
    platformLogo: {
        width: 50,
        height: 20,
        resizeMode: 'contain',
        marginVertical: 6,
    },
    price: {
        color: '#dc3545',
        fontWeight: 'bold',
        fontSize: 14,
    },
    buyButton: {
        marginTop: 8,
        backgroundColor: '#ff69b4',
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 11,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 14,
        color: '#20c997',
    },
    table: {
        backgroundColor: '#fff5fb',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#f8d7da',
        overflow: 'hidden',
    },
    tableHeader: {
        backgroundColor: '#fce4ec',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: '#f3c6cb',
        paddingVertical: 12,
        alignItems: 'center',
    },
    labelCell: {
        flex: 1.6,
        fontWeight: '600',
        paddingHorizontal: 8,
        fontSize: 13,
        color: '#343a40',
    },
    valueCell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 13,
        color: '#495057',
    },
    valueCellHeader: {
        flex: 1,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: 'bold',
        color: '#d63384',
    },
});
