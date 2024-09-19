SELECT d.id AS dashboard_id, d.dashboard_title, COUNT(l.dashboard_id) AS "Access Count"
FROM dashboards d
LEFT JOIN logs l ON d.id = l.dashboard_id
WHERE l.dashboard_id IS NOT NULL
  AND l.action = 'ChartDataRestApi.data'
GROUP BY d.id, d.dashboard_title;
