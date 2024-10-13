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

const DetailsDocument: React.FC<MyDocumentProps> = ({ images }) => (
  <Document>
    {images.map((image, index) => (
      <Page key={index} size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Auditoria BPM - Detalle {index + 1}</Text>
        </View>
        <View style={styles.section}>
          <Image src={image} style={styles.image} />
        </View>
      </Page>
    ))}
  </Document>
);

export default DetailsDocument;
