// websocketConfig.js

// 主机地址
export const SERVICE_HOST = '127.0.0.1';

// WebSockets 协议
export const PROTOCOL_WS = 'ws://';
export const PROTOCOL_WSS = 'wss://';
// 默认通讯协议
export const PROTOCOL_DEFAULT = PROTOCOL_WS;

// 各种WebSocket端口配置
export const serviceWebsocketPort = ':37561/';
export const serviceWebsocketPortWSS = ':37571/';

export const cardWebsocketPort = ':35561/';
export const cardWebsocketPortWSS = ':35571/';

export const liveWebsocketPort = ':36256/';
export const liveWebsocketPortWSS = ':36266/';

export const liveWebsocketSourcePort = ':36257/';
export const liveWebsocketSourcePortWSS = ':36267/';

export const signWebsocketPort = ':32561/';
export const signWebsocketPortWSS = ':32571/';

export const signWebsocketSourcePort = ':42561/';
export const signWebsocketSourcePortWSS = ':42571/';

export const videoWebsocketPort = ':34256/';
export const videoWebsocketPortWSS = ':34266/';

export const videoWebsocketSourcePort = ':34257/';
export const videoWebsocketSourcePortWSS = ':34267/';