import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metric to track cache hit rate
const cacheHitRate = new Rate('cache_hit_rate');

export const options = {
  stages: [
    { duration: '10s', target: 50 }, // Ramp-up to 50 users
    { duration: '30s', target: 300 }, // Ramp-up to 300 users
    { duration: '60s', target: 300 }, // Stay at 300 users for 60 seconds
    { duration: '10s', target: 0 }, // Ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<150'], // 95% of requests must complete below 150ms
    'http_req_duration{name:drillsList}': ['p(95)<150'], // 95% of drill list requests must complete below 150ms
    'http_req_duration{name:drillDetail}': ['p(95)<200'], // 95% of drill detail requests must complete below 200ms
  },
};

// Main function
export default function () {
  const baseUrl = 'http://localhost:4000';
  
  // Test GET /api/drills (cached endpoint)
  const drillsListResponse = http.get(`${baseUrl}/api/drills`, {
    tags: { name: 'drillsList' },
  });
  
  // Check if the drills list request was successful
  check(drillsListResponse, {
    'drills list status is 200': (r) => r.status === 200,
    'drills list has data': (r) => r.json().length > 0,
  });
  
  // Get a random drill ID from the response
  let drillId = null;
  try {
    const drills = drillsListResponse.json();
    if (drills.length > 0) {
      const randomIndex = Math.floor(Math.random() * drills.length);
      drillId = drills[randomIndex]._id;
    }
  } catch (e) {
    console.error('Failed to parse drills list response:', e);
  }
  
  // If we got a drill ID, test GET /api/drills/:id
  if (drillId) {
    const drillDetailResponse = http.get(`${baseUrl}/api/drills/${drillId}`, {
      tags: { name: 'drillDetail' },
    });
    
    // Check if the drill detail request was successful
    check(drillDetailResponse, {
      'drill detail status is 200': (r) => r.status === 200,
      'drill detail has data': (r) => r.json()._id === drillId,
    });
  }
  
  // Small sleep to prevent overwhelming the server
  sleep(0.1);
}