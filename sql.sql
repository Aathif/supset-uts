SELECT dashboard_id, COUNT(*) AS "Access Count" from logs WHERE dashboard_id IS NOT NULL and logs.action = 'ChartDataRestApi.data' GROUP BY dashboard_id;


select id, dashboard_title FROM dashboards;
