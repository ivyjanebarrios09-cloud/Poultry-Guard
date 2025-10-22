export type FlyCountLog = {
  id: string;
  date: string;
  count: number;
  analysis: string;
};

export type Device = {
  id: string;
  location: string;
  status: 'Online' | 'Offline';
  lastSeen: string;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
};

export const flyCountLogs: FlyCountLog[] = [
  { id: '1', date: '2024-07-21T10:00:00Z', count: 152, analysis: 'Slight increase from last week.' },
  { id: '2', date: '2024-07-14T10:00:00Z', count: 140, analysis: 'Stable count.' },
  { id: '3', date: '2024-07-07T10:00:00Z', count: 135, analysis: 'Count within acceptable limits.' },
  { id: '4', date: '2024-06-30T10:00:00Z', count: 168, analysis: 'Spike detected, requires attention.' },
  { id: '5', date: '2024-06-23T10:00:00Z', count: 120, analysis: 'Low count, effective control.' },
];

export const devices: Device[] = [
  { id: 'PGP-001', location: 'Barn A, Section 1', status: 'Online', lastSeen: '2024-07-21T12:05:00Z' },
  { id: 'PGP-002', location: 'Barn A, Section 2', status: 'Online', lastSeen: '2024-07-21T12:04:30Z' },
  { id: 'PGP-003', location: 'Barn B, Section 1', status: 'Offline', lastSeen: '2024-07-20T18:30:00Z' },
  { id: 'PGP-004', location: 'Barn B, Section 2', status: 'Online', lastSeen: '2024-07-21T12:02:15Z' },
  { id: 'PGP-005', location: 'Processing Area', status: 'Online', lastSeen: '2024-07-21T12:05:10Z' },
];

export const notifications: Notification[] = [
  { id: '1', title: 'High Fly Count Alert', description: 'Fly count in Barn B, Section 1 exceeded threshold with 180 flies.', timestamp: '2024-07-20T08:00:00Z', read: false },
  { id: '2', title: 'Device Offline', description: 'Device PGP-003 in Barn B, Section 1 has been offline for 12 hours.', timestamp: '2024-07-21T06:30:00Z', read: false },
  { id: '3', title: 'Weekly Report Ready', description: 'Your weekly fly count summary report is generated and ready for download.', timestamp: '2024-07-19T17:00:00Z', read: true },
  { id: '4', title: 'Firmware Update', description: 'All devices were successfully updated to the latest firmware version.', timestamp: '2024-07-18T02:00:00Z', read: true },
];
