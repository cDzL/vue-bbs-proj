create database bbs;
use bbs;
create table users(
	userid int auto_increment primary key,
    username varchar(20) not null unique,
    upassword varchar(11) not null,
    att_img varchar(100) default '',
    signalname varchar(30) default '默认签名',
    sex boolean default true,
    age integer default 0,
    telphone varchar(11) default '',
    address varchar(50) default '地球',
    state Boolean default false,
    fansnum int default 0,
    subsnum int default 0,
    sort boolean default false,
    email varchar(50) not null,
    regdate date
);	
create table articles(
	aid int auto_increment primary key,
    userid int not null,
    title varchar(60) not null,
    content text not null,
    plateid varchar(20) default '其他',
    support int default 0,
    commut int default 0,
    collect int default 0,
    supporter text,
    commuter text,
    collecter text,
    pubtime date
);
create table plate(
	plateid int auto_increment primary key,
    platename varchar(20) not null unique
);
create table author(
	userid int primary key,
    plateid int
);
create table notice(
	noticeid int auto_increment primary key,
    content text not null,
    noticetime date,
    title varchar(60) not null
);
create table admins(
	id int auto_increment primary key,
    adminname varchar(20) not null,
    adminpassword varchar(11) not null
);
create table commut(
	commutid int auto_increment primary key,
    userid int not null,
    aid int not null,
    content varchar(60) not null,
    comtime date
);
create table fans(
	id int unique auto_increment,
	userid int,
    fanid int
);

create table subs(
    id int unique auto_increment,
	userid int,
    subsid int
);

create table reply(
	replyid int auto_increment primary key,
    commutid int not null,
    content varchar(60) not null,
    fromuserid int,
    touserid int,
    replytime date
);
create table message(
	messageid int auto_increment primary key,
    aid int not null,
    content varchar(80) not null,
    messagetime date,
    fromuserid int,
    touserid int,
    flag boolean
);
create table offmessage(
	messageid int auto_increment primary key,
    aid int not null,
    content varchar(80) not null,
    messagetime date,
    fromuserid int,
    touserid int,
    flag boolean
);
create table collects(
	collectid int auto_increment primary key,
    userid int not null,
    aid int not null
);
create table report(
	reportid int auto_increment primary key,
    userid int not null,
    username varchar(20),
    reason varchar(50),
    aid int not null
);
create table askfor (
	askforid int auto_increment primary key,
    userid int not null,
    username varchar(20) not null
);
create table personalmsg(
	personalmsgid int auto_increment primary key,
    content varchar(80) not null,
    fromuserid int not null,
    touserid int not null,
    pmsgtime date
);
create table offpersonalmsg(
	offpersonalmsgid int auto_increment primary key,
    content varchar(80) not null,
    fromuserid int not null,
    touserid int not null,
    pmsgtime date
);

create table setting (
	settingid int auto_increment primary key,
    username varchar(20) not null unique,
    activepersonal boolean not null default false,
    commentpersonal boolean not null default false,
    collectpersonal boolean not null default false
);
create table emoji (
	emoid int auto_increment primary key,
    emodec int not null,
    emoname varchar(20) default '表情'
);
# 修改数据库:
ALTER DATABASE bbs CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
# 修改表:
ALTER TABLE articles CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
# 修改表字段:
ALTER TABLE articles CHANGE content content text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

create table backgroundimg (
	bgimgid int auto_increment primary key,
    bgurl varchar(80) not null
);
--  --------------------------------------------------------------------------------------------------
