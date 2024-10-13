import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    textAlign: 'center',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: 'auto',
  },
});

interface MyDocumentProps {
  images: string[];
}

const ETADocument: React.FC<MyDocumentProps> = ({ images }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>Auditoria BPM</Text>
      </View>
      <View style={styles.section}>
        <Text>ETA</Text>
      </View>

      {images.map((image, index) => (
        <View key={index} style={styles.section}>
          <Image src={image} style={styles.image} />
        </View>
      ))}
    </Page>
  </Document>
);

export default ETADocument;
