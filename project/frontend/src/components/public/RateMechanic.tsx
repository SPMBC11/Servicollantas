import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, CheckCircle, AlertCircle, Send } from 'lucide-react';
import logo from '../../assets/servi-collantas-logo.png';

interface RatingData {
  appointmentId: string;
  mechanicId: string;
  mechanicName: string;
  clientName: string;
  vehicleInfo: string;
  serviceName: string;
  date: string;
  time: string;
}

const RateMechanic: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  useEffect(() => {
    const fetchTokenData = async () => {
      if (!token) {
        setError('Token no válido');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${backendUrl}/api/ratings/token/${token}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.message || 'Token inválido o expirado');
          setLoading(false);
          return;
        }

        const data = await res.json();
        setRatingData(data);
        setClientName(data.clientName || '');
        setClientEmail(data.clientEmail || '');
      } catch (err) {
        console.error('Error fetching token data:', err);
        setError('Error al cargar la información');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [token, backendUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Por favor selecciona una calificación');
      return;
    }

    if (!clientName || !clientEmail) {
      setError('Por favor completa tu nombre y email');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${backendUrl}/api/ratings/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          rating,
          comment,
          clientName,
          clientEmail,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || 'Error al enviar la calificación');
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError('Error al enviar la calificación. Intenta de nuevo.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error && !ratingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Gracias por tu calificación!</h2>
          <p className="text-gray-600 mb-6">
            Tu opinión es muy importante para nosotros. Hemos registrado tu calificación.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Servi Collantas" className="w-24" />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Califica tu Servicio
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Ayúdanos a mejorar compartiendo tu experiencia
        </p>

        {ratingData && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Detalles del Servicio</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Mecánico:</span> {ratingData.mechanicName}</p>
              <p><span className="font-medium">Vehículo:</span> {ratingData.vehicleInfo}</p>
              <p><span className="font-medium">Servicio:</span> {ratingData.serviceName}</p>
              <p><span className="font-medium">Fecha:</span> {ratingData.date} a las {ratingData.time}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Stars */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ¿Cómo calificarías el servicio? *
            </label>
            <div className="flex items-center gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                  aria-label={`Calificar ${star} estrellas`}
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoverRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {rating === 1 && 'Muy malo'}
                {rating === 2 && 'Malo'}
                {rating === 3 && 'Regular'}
                {rating === 4 && 'Bueno'}
                {rating === 5 && 'Excelente'}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comentarios (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Comparte tu experiencia con el servicio..."
            />
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu Nombre *
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu Email *
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="juan@example.com"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Enviar Calificación
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RateMechanic;

