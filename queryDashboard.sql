SELECT d.id AS dashboard_id, d.dashboard_title, COUNT(l.dashboard_id) AS "Access Count"
FROM dashboards d
LEFT JOIN logs l ON d.id = l.dashboard_id
WHERE l.dashboard_id IS NOT NULL
  AND l.action = 'ChartDataRestApi.data'
GROUP BY d.id, d.dashboard_title;



SELECT 
    d.dashboard_title, 
    COUNT(DISTINCT l.user_id) AS unique_user_count
FROM logs l
JOIN dashboards d ON l.dashboard_id = d.id
WHERE l.dashboard_id IS NOT NULL 
  AND l.action = 'ChartDataRestApi.data'
GROUP BY d.id, d.dashboard_title
ORDER BY unique_user_count DESC;

