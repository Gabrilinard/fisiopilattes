import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { MapaContainer, MapWrapper } from '../../style';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ location, endereco }) => {
  if (!location) return null;

  return (
    <MapaContainer>
      <h3 style={{ marginBottom: '10px' }}>Localização do Profissional</h3>
      {endereco && <p style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>{endereco}</p>}
      <MapWrapper>
        <MapContainer 
          center={[location.lat, location.lng]} 
          zoom={15} 
          style={{ height: '100%', width: '100%', borderRadius: '10px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[location.lat, location.lng]} />
        </MapContainer>
      </MapWrapper>
    </MapaContainer>
  );
};

export default MapComponent;
