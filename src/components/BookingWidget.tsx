'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import cx from 'classnames';
import HotelIcon from '@mui/icons-material/Hotel';
import FlightIcon from '@mui/icons-material/Flight';
import TrainIcon from '@mui/icons-material/Train';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import Block, { BlockTitle } from './Block';

// -- Affiliate IDs (replace with actual values)
const BOOKING_AID = 'BOOKING_AID_PLACEHOLDER';
const AGODA_CID = '1723497';
const BAOLAU_SOURCE = 'vietnamcoracle';

// -- Vietnam cities for Stay tab
// Ho Tram, Mui Ne, and Tam Coc have no standalone Agoda city IDs — Agoda
// classifies them as areas within Vung Tau, Phan Thiet, and Ninh Binh
// respectively. The search URL passes `city` + `area` to land on the area.
const VIETNAM_AGODA_CITY_IDS = {
  'Ben Tre': 204056,
  'Buon Ma Thuot': 19603,
  'Can Tho': 16079,
  'Cao Bang': 204057,
  'Cat Ba': 17243,
  'Cat Tien': 702291,
  'Chau Doc': 17162,
  'Con Dao': 105652,
  'Da Lat': 15932,
  'Da Nang': 16440,
  'Dien Bien Phu': 19657,
  'Dong Hoi': 18866,
  'Ha Giang': 204060,
  'Ha Long': 17182,
  'Ha Tien': 21673,
  'Ha Tinh': 230985,
  'Hai Phong': 17161,
  Hanoi: 2758,
  'Ho Chi Minh City': 13170,
  'Ho Tram': { city: 17190, area: 281119 },
  'Hoi An': 16552,
  Hue: 3738,
  'Kon Tum': 204063,
  'Lao Cai': 106068,
  'Ly Son': 720976,
  'Mai Chau': 226263,
  'Moc Chau': 226464,
  'Mui Ne': { city: 16264, area: 502082 },
  'My Tho': 214967,
  'Nha Trang': 2679,
  'Ninh Binh': 17245,
  'Phan Rang': 21557,
  'Phan Thiet': 16264,
  'Phong Nha': 228387,
  'Phu Quoc': 17188,
  Pleiku: 78906,
  'Quy Nhon': 17242,
  'Sa Pa': 17160,
  'Tam Coc': { city: 17245, area: 482411 },
  'Tuy Hoa': 78908,
  Vinh: 115666,
  'Vung Tau': 17190,
};

type VietnamCity = keyof typeof VIETNAM_AGODA_CITY_IDS;
const VIETNAM_CITIES = Object.keys(VIETNAM_AGODA_CITY_IDS) as VietnamCity[];

// Types
type Tab = 'stay' | 'flights' | 'train' | 'bus';
type StayAffiliate = 'booking' | 'agoda' | 'airbnb';
type BaolauType = 'town' | 'plane' | 'train' | 'bus';

interface BaolauLocation {
  id: string;
  name: string;
  town: string;
  type: BaolauType;
  iata?: string;
}

const TABS: {
  id: Tab;
  label: string;
  tabLabel: string;
  Icon: React.ElementType;
}[] = [
  { id: 'stay', label: 'Stay', tabLabel: 'Stays', Icon: HotelIcon },
  { id: 'flights', label: 'Flight', tabLabel: 'Flights', Icon: FlightIcon },
  { id: 'train', label: 'Train', tabLabel: 'Trains', Icon: TrainIcon },
  { id: 'bus', label: 'Bus', tabLabel: 'Buses', Icon: DirectionsBusIcon },
];

interface Props {
  agodaHotelId?: string;
  initialCity?: VietnamCity;
  initialTab?: Tab;
  variant?: 'sidebar' | 'inline';
}

// URL builders

function addDays(date: string, n: number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
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

function agodaCommonParams(checkin: string, checkout: string, nights: number) {
  return {
    cid: AGODA_CID,
    hl: 'en',
    checkin,
    checkout,
    los: String(nights),
    adults: '2',
    rooms: '1',
    numberofchildren: '0',
  };
}

function agodaCityUrl(
  city: string,
  checkin: string,
  checkout: string,
  nights: number,
) {
  const entry = VIETNAM_AGODA_CITY_IDS[city];
  const cityId = typeof entry === 'number' ? entry : entry?.city;
  const areaId = typeof entry === 'object' ? entry.area : undefined;
  const p = new URLSearchParams({
    ...agodaCommonParams(checkin, checkout, nights),
    ...(cityId ? { city: String(cityId) } : { q: `${city} Vietnam` }),
    ...(areaId ? { area: String(areaId) } : {}),
  });
  return `https://www.agoda.com/search?${p}`;
}

function agodaHotelUrl(
  hotelId: string,
  checkin: string,
  checkout: string,
  _nights: number,
) {
  // partnersearch.aspx with pcs=1 is the format used by existing working links
  // on the site — param names are case-sensitive per the Affiliate Lite spec.
  const p = new URLSearchParams({
    pcs: '1',
    cid: AGODA_CID,
    hid: hotelId,
    checkin,
    checkout,
    NumberofAdults: '2',
    NumberofChildren: '0',
    Rooms: '1',
  });
  return `https://www.agoda.com/partners/partnersearch.aspx?${p}`;
}

function airbnbUrl(city: string, checkin: string, checkout: string) {
  const slug = city.replace(/\s+/g, '-');
  const p = new URLSearchParams({ checkin, checkout, adults: '2' });
  return `https://www.airbnb.com/s/${slug}--Vietnam/homes?${p}`;
}

function baolauUrl(
  origin: BaolauLocation,
  dest: BaolauLocation,
  date: string,
  transport: 'train' | 'bus' | 'plane',
) {
  const [year, month, day] = date.split('-');
  const p = new URLSearchParams({
    source: BAOLAU_SOURCE,
    departure: '',
    transports: transport,
    origin: origin.name,
    origin_id: origin.id,
    origin_town: origin.town,
    origin_town_lang: origin.town,
    origin_type: origin.type,
    destination: dest.name,
    destination_id: dest.id,
    destination_town: dest.town,
    destination_town_lang: dest.town,
    destination_type: dest.type,
    departure_date: `${day}/${month}/${year}`,
    return_date: '',
    roundtrip: 'no',
    passengers_count: '1',
  });
  return `https://booking.baolau.com/en/results/?${p}`;
}

export default function BookingWidget({
  agodaHotelId,
  initialCity = 'Hanoi',
  initialTab = 'stay',
  variant = 'sidebar',
}: Props) {
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const tomorrow = useMemo(() => addDays(today, 1), [today]);

  const [tab, setTab] = useState<Tab>(initialTab);
  const [city, setCity] = useState(initialCity);
  const [checkin, setCheckin] = useState(tomorrow);
  const [nights, setNights] = useState(2);
  const [affiliate, setAffiliate] = useState<StayAffiliate>('agoda');
  const [baolauLocations, setBaolauLocations] = useState<BaolauLocation[]>([]);
  const [planeFrom, setPlaneFrom] = useState<BaolauLocation | null>(null);
  const [planeTo, setPlaneTo] = useState<BaolauLocation | null>(null);
  const [trainFrom, setTrainFrom] = useState<BaolauLocation | null>(null);
  const [trainTo, setTrainTo] = useState<BaolauLocation | null>(null);
  const [busFrom, setBusFrom] = useState<BaolauLocation | null>(null);
  const [busTo, setBusTo] = useState<BaolauLocation | null>(null);
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
      const seen = new Set<string>();
      const normalized: BaolauLocation[] = (Array.isArray(data) ? data : [])
        .filter(
          (loc: any) =>
            loc.type === 'town' ||
            loc.type === 'plane' ||
            loc.type === 'train' ||
            loc.type === 'bus',
        )
        .map((loc: any) => {
          const name = String(loc.name || loc.town_name || '');
          const iataMatch = name.match(/\(([A-Z]{3})\)\s*$/);
          return {
            id: String(loc.id ?? '').replace(/^town-/, ''),
            name,
            town: String(loc.town || loc.name || '').toUpperCase(),
            type: loc.type as BaolauType,
            iata: iataMatch ? iataMatch[1] : undefined,
          };
        })
        .filter(l => l.id && l.name)
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(l => {
          const key = `${l.type}:${l.id}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      setBaolauLocations(normalized);
    } catch {
      setBaolauError(true);
    } finally {
      setBaolauLoading(false);
    }
  }, [baolauLocations.length, baolauLoading, baolauError]);

  const planeOptions = useMemo(
    () => baolauLocations.filter(l => l.type === 'plane'),
    [baolauLocations],
  );
  const trainOptions = useMemo(
    () => baolauLocations.filter(l => l.type === 'train'),
    [baolauLocations],
  );

  const handleTabChange = (id: Tab) => {
    setTab(id);
    if (id === 'train' || id === 'bus' || id === 'flights') loadBaolau();
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
        url = agodaHotelUrl(agodaHotelId, checkin, checkout, nights);
      } else if (affiliate === 'booking') {
        url = bookingComUrl(searchCity, checkin, checkout);
      } else if (affiliate === 'agoda') {
        url = agodaCityUrl(searchCity, checkin, checkout, nights);
      } else {
        url = airbnbUrl(searchCity, checkin, checkout);
      }
    } else if (tab === 'flights' && planeFrom && planeTo) {
      url = baolauUrl(planeFrom, planeTo, baolauDate, 'plane');
    } else if (tab === 'train' && trainFrom && trainTo) {
      url = baolauUrl(trainFrom, trainTo, baolauDate, 'train');
    } else if (tab === 'bus' && busFrom && busTo) {
      url = baolauUrl(busFrom, busTo, baolauDate, 'bus');
    }
    if (url) window.open(url, '_blank', 'noopener');
  };

  const activeTab = TABS.find(t => t.id === tab)!;

  // Inline widgets live inside a shadow root where the parent page's
  // `.force-light-theme` class cannot reach. Strip `dark:` variants so the
  // widget matches the light-themed article it is embedded in.
  const forceLight = variant === 'inline';
  const tw = (cls: string) =>
    forceLight
      ? cls
          .split(/\s+/)
          .filter(t => !t.startsWith('dark:'))
          .join(' ')
      : cls;

  const fieldCls = tw(
    'w-full rounded-lg px-3 py-2 text-sm font-sans outline-none ' +
      'bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 ' +
      'text-gray-700 dark:text-gray-200 ' +
      'focus:border-gray-500 dark:focus:border-gray-500 ' +
      'hover:border-gray-400 dark:hover:border-gray-600',
  );
  const selectCls = fieldCls + ' select-chevron pr-8';

  const labelCls = tw(
    'block text-xs text-gray-500 dark:text-gray-400 mb-1 font-sans',
  );

  // Chevron background as inline style so it renders inside the custom
  // element's shadow root (where `select-chevron` from global.css cannot
  // reach). Also pushes the chevron away from the right edge.
  const selectChevronStyle: React.CSSProperties | undefined = forceLight
    ? {
        appearance: 'none',
        WebkitAppearance: 'none',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%236b7280' stroke-width='1.5' fill='none' stroke-linecap='round'/></svg>\")",
        backgroundPosition: 'right 1rem center',
        backgroundSize: '12px 8px',
      }
    : undefined;

  const isBaolau = tab === 'flights' || tab === 'train' || tab === 'bus';
  const baolauReady = baolauLocations.length > 0;
  const searchDisabled =
    (tab === 'stay' && !checkin) ||
    (tab === 'flights' && (!planeFrom || !planeTo)) ||
    (tab === 'train' && (!trainFrom || !trainTo)) ||
    (tab === 'bus' && (!busFrom || !busTo)) ||
    (isBaolau && !baolauReady && !baolauError);

  const inner = (
    <>
      {/* Title */}
      <BlockTitle>
        Book Your <span className="text-primary-500">{activeTab.label}</span>
      </BlockTitle>

      {/* Tab navigation */}
      {!forceLight && (
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {TABS.map(({ id, tabLabel, Icon }) => (
            <button
              key={id}
              type="button"
              className={cx(
                'flex flex-col items-center justify-center gap-1 rounded-xl transition-colors',
                'text-xs font-sans w-16 h-16',
                tab === id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500',
              )}
              onClick={() => handleTabChange(id)}>
              <Icon className="!w-5 !h-5" />
              <span>{tabLabel}</span>
            </button>
          ))}
        </div>
      )}

      {/* Form card */}
      <div
        className={tw(
          cx(
            'bg-gray-100 dark:bg-gray-900 rounded-xl p-4 text-left',
            forceLight ? 'w-full' : 'mx-auto max-w-xs',
          ),
        )}>
        {/* Stay */}
        {tab === 'stay' && (
          <>
            {!agodaHotelId && (
              <div className="mb-3">
                <label className={labelCls}>City:</label>
                <select
                  className={selectCls}
                  value={city}
                  onChange={e => setCity(e.target.value as VietnamCity)}>
                  {VIETNAM_CITIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={forceLight ? '' : 'flex gap-2 mb-3'}>
              <div className={forceLight ? 'mb-3' : 'flex-1 min-w-0'}>
                <label className={labelCls}>Check-in:</label>
                <input
                  className={fieldCls}
                  type="date"
                  value={checkin}
                  min={today}
                  style={forceLight ? { colorScheme: 'light' } : undefined}
                  onChange={e => setCheckin(e.target.value)}
                />
              </div>
              <div className={forceLight ? 'mb-3' : 'flex-1 min-w-0'}>
                <label className={labelCls}>Nights:</label>
                <select
                  className={selectCls}
                  style={selectChevronStyle}
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

            {!agodaHotelId && (
              <div className="mb-4">
                <label className={labelCls}>With:</label>
                <select
                  className={selectCls}
                  style={selectChevronStyle}
                  value={affiliate}
                  onChange={e => setAffiliate(e.target.value as StayAffiliate)}>
                  <option value="agoda">Agoda</option>
                  <option value="airbnb">Airbnb</option>
                  <option value="booking">Booking.com</option>
                </select>
              </div>
            )}
          </>
        )}

        {/* Baolau-backed tabs (flights / train / bus) */}
        {isBaolau && (
          <>
            {baolauError ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 font-sans mb-3">
                Location data unavailable. Please run{' '}
                <code className="text-xs">npm run build</code> first.
              </p>
            ) : baolauLoading && !baolauReady ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 font-sans mb-3">
                Loading locations…
              </p>
            ) : baolauReady ? (
              <>
                {tab === 'flights' ? (
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <BaolauAutocomplete
                        label="From"
                        placeholder="e.g. Hanoi"
                        options={planeOptions}
                        value={planeFrom}
                        onChange={setPlaneFrom}
                        fieldCls={fieldCls}
                        labelCls={labelCls}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <BaolauAutocomplete
                        label="To"
                        placeholder="e.g. Ho Chi Minh"
                        options={planeOptions}
                        value={planeTo}
                        onChange={setPlaneTo}
                        fieldCls={fieldCls}
                        labelCls={labelCls}
                      />
                    </div>
                  </div>
                ) : tab === 'train' ? (
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <BaolauAutocomplete
                        label="From"
                        placeholder="Type a station"
                        options={trainOptions}
                        value={trainFrom}
                        onChange={setTrainFrom}
                        fieldCls={fieldCls}
                        labelCls={labelCls}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <BaolauAutocomplete
                        label="To"
                        placeholder="Type a station"
                        options={trainOptions}
                        value={trainTo}
                        onChange={setTrainTo}
                        fieldCls={fieldCls}
                        labelCls={labelCls}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <BaolauAutocomplete
                        label="From"
                        placeholder="Type a location"
                        options={baolauLocations}
                        value={busFrom}
                        onChange={setBusFrom}
                        fieldCls={fieldCls}
                        labelCls={labelCls}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <BaolauAutocomplete
                        label="To"
                        placeholder="Type a location"
                        options={baolauLocations}
                        value={busTo}
                        onChange={setBusTo}
                        fieldCls={fieldCls}
                        labelCls={labelCls}
                      />
                    </div>
                  </div>
                )}
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
          disabled={searchDisabled}
          className={tw(
            cx(
              forceLight
                ? 'mt-1 w-full h-12 gap-1 inline-flex items-center justify-center text-sm font-sans font-medium tracking-wider rounded-lg text-white bg-primary-500 border border-primary-500 hover:bg-primary-600 hover:border-primary-400 focus:outline-none transition-colors duration-100 ease-in-out whitespace-nowrap'
                : 'btn btn-primary mt-1 w-full h-12 gap-1',
              'disabled:bg-gray-400 disabled:cursor-not-allowed',
            ),
          )}
          onClick={handleSearch}>
          {agodaHotelId && tab === 'stay'
            ? 'Check rates on Agoda'
            : `Search ${tab === 'stay' ? 'Hotels' : activeTab.tabLabel}`}{' '}
          ›
        </button>
      </div>
    </>
  );

  if (variant === 'inline') {
    return <div className="my-8 text-center font-display">{inner}</div>;
  }

  return <Block>{inner}</Block>;
}

// Shadow-DOM-safe typeahead. Uses e.composedPath() so outside-click detection
// works correctly when rendered inside an open shadow root (custom element).
function BaolauAutocomplete({
  label,
  placeholder,
  options,
  value,
  onChange,
  fieldCls,
  labelCls,
}: {
  label: string;
  placeholder?: string;
  options: BaolauLocation[];
  value: BaolauLocation | null;
  onChange: (loc: BaolauLocation | null) => void;
  fieldCls: string;
  labelCls: string;
}) {
  const [query, setQuery] = useState(value?.name ?? '');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) setQuery(value?.name ?? '');
  }, [value, open]);

  useEffect(() => {
    function handleDown(e: MouseEvent) {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const path = typeof e.composedPath === 'function' ? e.composedPath() : [];
      if (!path.includes(wrapper)) {
        setOpen(false);
        setQuery(value?.name ?? '');
      }
    }
    document.addEventListener('mousedown', handleDown);
    return () => document.removeEventListener('mousedown', handleDown);
  }, [value]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const iataHits: BaolauLocation[] = [];
    const other: BaolauLocation[] = [];
    for (const o of options) {
      const iata = o.iata?.toLowerCase();
      if (iata === q) iataHits.push(o);
      else if (o.name.toLowerCase().includes(q) || (iata && iata.includes(q)))
        other.push(o);
    }
    return [...iataHits, ...other].slice(0, 20);
  }, [query, options]);

  return (
    <div ref={wrapperRef} className="relative">
      <label className={labelCls}>{label}</label>
      <input
        type="text"
        className={fieldCls}
        value={query}
        placeholder={placeholder}
        onChange={e => {
          setQuery(e.target.value);
          if (value) onChange(null);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 mt-1 max-h-56 overflow-auto rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg text-sm font-sans">
          {filtered.map(o => (
            <li
              key={`${o.type}-${o.id}`}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
              onMouseDown={() => {
                onChange(o);
                setQuery(o.name);
                setOpen(false);
              }}>
              {o.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
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
