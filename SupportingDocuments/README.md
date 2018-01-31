# Contact Manager Application
Link - cop4331groupeight.com

Database - please run a local database with the credentials
  servername: "localhost"
  username: "root"
  password: ""
  database: "cop4331"
  
 
 
Configure the database using the mySQL script provided below: 

CREATE TABLE users (
    username varchar(12) NOT NULL,
    password varchar(66) NOT NULL,
    first_name varchar(12) NOT NULL,
    last_name varchar(24) NOT NULL,
    email varchar(24) NOT NULL,
    CONSTRAINT USERS_PK PRIMARY KEY (username)
);

CREATE TABLE contacts (
    first_name varchar(24) NOT NULL,
    last_name varchar(24) NOT NULL,
    email varchar(24) NOT NULL, 
    phone int(11) NOT NULL,
    address varchar(50) NOT NULL,
    username_link varchar(12) NOT NULL,
    cid int NOT NULL auto_increment,
    CONSTRAINT CONTACTS_PK PRIMARY KEY (cid),
    CONSTRAINT CONTACTS_FK FOREIGN KEY(username_link) REFERENCES users(username)
);
