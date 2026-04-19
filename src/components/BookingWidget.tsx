'use client';

import { useState, useMemo, useCallback } from 'react';
import cx from 'classnames';
import HotelIcon from '@mui/icons-material/Hotel';
import FlightIcon from '@mui/icons-material/Flight';
import TrainIcon from '@mui/icons-material/Train';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import Block, { BlockTitle } from './Block';

// ─── Affiliate IDs (replace with actual values) ───────────────────
const BOOKING_AID = 'BOOKING_AID_PLACEHOLDER';
const AGODA_CID = 'AGODA_CID_PLACEHOLDER';
const SKYSCANNER_PARTNER = 'SKYSCANNER_PARTNER_PLACEHOLDER';
const BAOLAU_SOURCE = 'vietnamcoracle';

// ─── Vietnam cities for Stay tab ─────────────────────────────────
const VIETNAM_CITIES = [
  'Ba Ria-Vung Tau',
  'Ben Tre',
  'Buon Ma Thuot',
  'Can Tho',
  'Con Dao',
  'Da Lat',
  'Da Nang',
  'Dien Bien Phu',
  'Ha Giang',
  'Ha Long',
  'Hai Phong',
  'Hanoi',
  'Ho Chi Minh City',
  'Hoi An',
  'Hue',
  'Kon Tum',
  'Lao Cai',
  'Mui Ne',
  'My Tho',
  'Nha Trang',
  'Ninh Binh',
  'Phan Rang',
  'Phan Thiet',
  'Phu Quoc',
  'Pleiku',
  'Quy Nhon',
  'Sa Pa',
  'Tam Coc',
  'Tuy Hoa',
  'Vinh',
  'Vung Tau',
];

// ─── Vietnam airports for Flights tab ────────────────────────────
const VIETNAM_AIRPORTS = [
  { city: 'Buon Ma Thuot', iata: 'BMV' },
  { city: 'Can Tho', iata: 'VCA' },
  { city: 'Con Dao', iata: 'VCS' },
  { city: 'Da Lat', iata: 'DLI' },
  { city: 'Da Nang', iata: 'DAD' },
  { city: 'Dong Hoi', iata: 'VDH' },
  { city: 'Hai Phong', iata: 'HPH' },
  { city: 'Hanoi', iata: 'HAN' },
  { city: 'Ho Chi Minh City', iata: 'SGN' },
  { city: 'Hue', iata: 'HUI' },
  { city: 'Nha Trang', iata: 'CXR' },
  { city: 'Phu Quoc', iata: 'PQC' },
  { city: 'Pleiku', iata: 'PXU' },
  { city: 'Quy Nhon', iata: 'UIH' },
  { city: 'Rach Gia', iata: 'VKG' },
];

// ─── Types ────────────────────────────────────────────────────────
type Tab = 'stay' | 'flights' | 'train' | 'bus';
type StayAffiliate = 'booking' | 'agoda' | 'airbnb';

interface BaolauLocation {
  id: number;
  name: string;
  town: string;
}

const TABS: { id: Tab; label: string; Icon: React.ElementType }[] = [
  { id: 'stay', label: 'Stay', Icon: HotelIcon },
  { id: 'flights', label: 'Flights', Icon: FlightIcon },
  { id: 'train', label: 'Train', Icon: TrainIcon },
  { id: 'bus', label: 'Bus', Icon: DirectionsBusIcon },
];

interface Props {
  agodaHotelId?: string;
  initialCity?: string;
  initialTab?: Tab;
  variant?: 'sidebar' | 'inline';
}

// ─── URL builders ─────────────────────────────────────────────────

function addDays(date: string, n: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

function bookingComUrl(city: string, checkin: string, checkout: string) {
  const p = new URLSearchParams({
    aid: BOOKING_AID,
    checkin,
    checkout,
    ss: `${city}, Vietnam`,
    lang: 'en-gb',
  });
  return `https://www.booking.com/searchresults.html?${p}`;
}

function agodaCityUrl(city: string, checkin: string, nights: number) {
  const p = new URLSearchParams({
    q: `${city} Vietnam`,
    checkIn: checkin,
    los: String(nights),
    adults: '2',
    cid: AGODA_CID,
  });
  return `https://www.agoda.com/search?${p}`;
}

function agodaHotelDirectUrl(hotelId: string, checkin: string, nights: number) {
  const p = new URLSearchParams({
    adults: '2',
    checkIn: checkin,
    los: String(nights),
    cid: AGODA_CID,
  });
  return `https://www.agoda.com/hotel/${hotelId}.html?${p}`;
}

function airbnbUrl(city: string, checkin: string, checkout: string) {
  const slug = city.replace(/\s+/g, '-');
  const p = new URLSearchParams({ checkin, checkout, adults: '2' });
  return `https://www.airbnb.com/s/${slug}--Vietnam/homes?${p}`;
}

function skyscannerUrl(from: string, to: string, date: string) {
  const d = new Date(date);
  const yymmdd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `https://www.skyscanner.com/transport/flights/${from.toLowerCase()}/${to.toLowerCase()}/${yymmdd}/?referral_pl=${SKYSCANNER_PARTNER}`;
}

function baolauUrl(
  origin: BaolauLocation,
  dest: BaolauLocation,
  date: string,
  transport: 'train' | 'bus',
) {
  const [year, month, day] = date.split('-');
  const p = new URLSearchParams({
    source: BAOLAU_SOURCE,
    departure: '',
    transports: transport,
    origin: origin.name,
    origin_id: String(origin.id),
    origin_town: origin.town,
    origin_town_lang: origin.town,
    origin_type: 'town',
    destination: dest.name,
    destination_id: String(dest.id),
    destination_town: dest.town,
    destination_town_lang: dest.town,
    destination_type: 'town',
    departure_date: `${day}/${month}/${year}`,
    return_date: '',
    roundtrip: 'no',
    passengers_count: '1',
  });
  return `https://booking.baolau.com/en/results/?${p}`;
}

// ─── Component ────────────────────────────────────────────────────

export default function BookingWidget({
  agodaHotelId,
  initialCity,
  initialTab = 'stay',
  variant = 'sidebar',
}: Props) {
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrow = useMemo(() => addDays(today, 1), [today]);

  const [tab, setTab] = useState<Tab>(initialTab);
  const [city, setCity] = useState(initialCity ?? VIETNAM_CITIES[11]); // Hanoi
  const [checkin, setCheckin] = useState(tomorrow);
  const [nights, setNights] = useState(2);
  const [affiliate, setAffiliate] = useState<StayAffiliate>('booking');
  const [fromAirport, setFromAirport] = useState(VIETNAM_AIRPORTS[7].iata); // HAN
  const [toAirport, setToAirport] = useState(VIETNAM_AIRPORTS[8].iata); // SGN
  const [flightDate, setFlightDate] = useState(tomorrow);
  const [baolauLocations, setBaolauLocations] = useState<BaolauLocation[]>([]);
  const [baolauFrom, setBaolauFrom] = useState<number | null>(null);
  const [baolauTo, setBaolauTo] = useState<number | null>(null);
  const [baolauDate, setBaolauDate] = useState(tomorrow);
  const [baolauLoading, setBaolauLoading] = useState(false);
  const [baolauError, setBaolauError] = useState(false);

  const loadBaolau = useCallback(async () => {
    if (baolauLocations.length > 0 || baolauLoading || baolauError) return;
    setBaolauLoading(true);
    try {
      const res = await fetch('/baolau_locations.json');
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      const vietnam = (Array.isArray(data) ? data : []).filter(
        (loc: any) =>
          loc.country_code === 'VN' ||
          loc.country_id === 'VN' ||
          (loc.country && /vietnam/i.test(loc.country)),
      );
      const normalized: BaolauLocation[] = vietnam
        .map((loc: any) => ({
          id: Number(loc.id),
          name: String(loc.name || loc.town_name || ''),
          town: String(loc.town || loc.name || '').toUpperCase(),
        }))
        .filter(l => l.id && l.name)
        .sort((a, b) => a.name.localeCompare(b.name));
      setBaolauLocations(normalized);
      if (normalized.length > 0) {
        setBaolauFrom(normalized[0].id);
        setBaolauTo(normalized.length > 1 ? normalized[1].id : normalized[0].id);
      }
    } catch {
      setBaolauError(true);
    } finally {
      setBaolauLoading(false);
    }
  }, [baolauLocations.length, baolauLoading, baolauError]);

  const handleTabChange = (id: Tab) => {
    setTab(id);
    if (id === 'train' || id === 'bus') loadBaolau();
  };

  const checkout = addDays(checkin, nights);

  const handleSearch = () => {
    let url = '';
    if (tab === 'stay') {
      // When a specific hotel is pre-loaded (inline widget replacing Agoda embed),
      // Agoda links directly to the hotel. Booking.com/Airbnb search Vietnam
      // broadly because cross-platform property IDs are not available from the
      // Agoda embed code alone.
      const searchCity = agodaHotelId ? 'Vietnam' : city;
      if (agodaHotelId && affiliate === 'agoda') {
        url = agodaHotelDirectUrl(agodaHotelId, checkin, nights);
      } else if (affiliate === 'booking') {
        url = bookingComUrl(searchCity, checkin, checkout);
      } else if (affiliate === 'agoda') {
        url = agodaCityUrl(searchCity, checkin, nights);
      } else {
        url = airbnbUrl(searchCity, checkin, checkout);
      }
    } else if (tab === 'flights') {
      url = skyscannerUrl(fromAirport, toAirport, flightDate);
    } else if ((tab === 'train' || tab === 'bus') && baolauFrom && baolauTo) {
      const from = baolauLocations.find(l => l.id === baolauFrom);
      const to = baolauLocations.find(l => l.id === baolauTo);
      if (from && to) url = baolauUrl(from, to, baolauDate, tab);
    }
    if (url) window.open(url, '_blank', 'noopener');
  };

  const activeTab = TABS.find(t => t.id === tab)!;

  const fieldCls =
    'w-full rounded-lg px-3 py-2 text-sm font-sans outline-none ' +
    'bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 ' +
    'text-gray-700 dark:text-gray-200 ' +
    'focus:border-gray-500 dark:focus:border-gray-500 ' +
    'hover:border-gray-400 dark:hover:border-gray-600';

  const labelCls = 'block text-xs text-gray-500 dark:text-gray-400 mb-1 font-sans';

  const isTransport = tab === 'train' || tab === 'bus';

  const inner = (
    <>
      {/* Title */}
      <BlockTitle>
        Book your{' '}
        <span className="text-red-600">{activeTab.label.toLowerCase()}</span>
      </BlockTitle>

      {/* Tab navigation */}
      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className={cx(
              'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors',
              'text-xs font-sans min-w-[52px]',
              tab === id
                ? 'bg-red-600 text-white'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500',
            )}
            onClick={() => handleTabChange(id)}>
            <Icon className="!w-5 !h-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Form card */}
      <div className="bg-gray-100 dark:bg-gray-900 rounded-xl p-4 text-left mx-auto max-w-xs">
        {/* Stay */}
        {tab === 'stay' && (
          <>
            {agodaHotelId ? (
              <p className="text-sm font-sans font-medium text-gray-700 dark:text-gray-300 mb-3">
                Book this hotel:
              </p>
            ) : (
              <div className="mb-3">
                <label className={labelCls}>City:</label>
                <select
                  className={fieldCls}
                  value={city}
                  onChange={e => setCity(e.target.value)}>
                  {VIETNAM_CITIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <label className={labelCls}>Check-in:</label>
                <input
                  className={fieldCls}
                  type="date"
                  value={checkin}
                  min={today}
                  onChange={e => setCheckin(e.target.value)}
                />
              </div>
              <div className="w-32 flex-shrink-0">
                <label className={labelCls}>Nights:</label>
                <select
                  className={fieldCls}
                  value={nights}
                  onChange={e => setNights(Number(e.target.value))}>
                  {Array.from({ length: 14 }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'night' : 'nights'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className={labelCls}>With:</label>
              <select
                className={fieldCls}
                value={affiliate}
                onChange={e => setAffiliate(e.target.value as StayAffiliate)}>
                <option value="booking">Booking.com</option>
                <option value="agoda">Agoda</option>
                <option value="airbnb">Airbnb</option>
              </select>
            </div>
          </>
        )}

        {/* Flights */}
        {tab === 'flights' && (
          <>
            <div className="flex gap-2 mb-3">
              <div className="flex-1 min-w-0">
                <label className={labelCls}>From:</label>
                <select
                  className={fieldCls}
                  value={fromAirport}
                  onChange={e => setFromAirport(e.target.value)}>
                  {VIETNAM_AIRPORTS.map(a => (
                    <option key={a.iata} value={a.iata}>
                      {a.city} ({a.iata})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-0">
                <label className={labelCls}>To:</label>
                <select
                  className={fieldCls}
                  value={toAirport}
                  onChange={e => setToAirport(e.target.value)}>
                  <option value="anywhere">Anywhere</option>
                  {VIETNAM_AIRPORTS.map(a => (
                    <option key={a.iata} value={a.iata}>
                      {a.city} ({a.iata})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className={labelCls}>Date:</label>
              <input
                className={fieldCls}
                type="date"
                value={flightDate}
                min={today}
                onChange={e => setFlightDate(e.target.value)}
              />
            </div>
            <PoweredBy
              name="Skyscanner"
              href="https://www.skyscanner.com"
            />
          </>
        )}

        {/* Train / Bus */}
        {isTransport && (
          <>
            {baolauError ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 font-sans mb-3">
                Location data unavailable. Please run{' '}
                <code className="text-xs">npm run build</code> first.
              </p>
            ) : baolauLoading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 font-sans mb-3">
                Loading locations…
              </p>
            ) : baolauLocations.length > 0 ? (
              <>
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <label className={labelCls}>From:</label>
                    <select
                      className={fieldCls}
                      value={baolauFrom ?? ''}
                      onChange={e => setBaolauFrom(Number(e.target.value))}>
                      {baolauLocations.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className={labelCls}>To:</label>
                    <select
                      className={fieldCls}
                      value={baolauTo ?? ''}
                      onChange={e => setBaolauTo(Number(e.target.value))}>
                      {baolauLocations.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className={labelCls}>Date:</label>
                  <input
                    className={fieldCls}
                    type="date"
                    value={baolauDate}
                    min={today}
                    onChange={e => setBaolauDate(e.target.value)}
                  />
                </div>
              </>
            ) : null}
            <PoweredBy name="Baolau" href="https://booking.baolau.com" />
          </>
        )}

        {/* Search button */}
        <button
          type="button"
          disabled={isTransport && baolauLocations.length === 0 && !baolauError}
          className={cx(
            'mt-1 w-full text-white font-sans font-semibold rounded-full py-3 text-sm',
            'transition-colors flex items-center justify-center gap-1',
            'bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed',
          )}
          onClick={handleSearch}>
          Search {activeTab.label.toLowerCase()} ›
        </button>
      </div>
    </>
  );

  if (variant === 'inline') {
    return (
      <div className="my-8 text-center font-display">{inner}</div>
    );
  }

  return <Block>{inner}</Block>;
}

function PoweredBy({ name, href }: { name: string; href: string }) {
  return (
    <p className="mb-3 text-xs text-gray-500 dark:text-gray-400 font-sans">
      Powered by{' '}
      <a
        href={href}
        className="font-medium text-gray-700 dark:text-gray-300 hover:underline"
        target="_blank"
        rel="noopener noreferrer">
        {name}
      </a>
    </p>
  );
}
