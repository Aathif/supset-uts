select * from tag;

create table user_favorite_tag(
tag_id INT NOT NULL, user_id INT NOT NULL,
CONSTRAINT fk_ab_user_user_favorite_tag FOREIGN KEY(user_id) REFERENCES ab_user(id),
CONSTRAINT fk_tag_user_favorite_tag FOREIGN KEY(tag_id) REFERENCES tag(id)
)
