select d.id, d.dashboard_title, COUNT(logs.dashboard_id) AS "Access Count"
from logs
JOIN dashboards d ON logs.dashboard_id = d.id
JOIN logs l on l.dashboard_id = d.id
WHERE l.dashboard_id IS NOT NULL and l.action = 'ChartDataRestApi.data'
GROUP BY d.id, d.dashboard_title;


select id, dashboard_title FROM dashboards;
