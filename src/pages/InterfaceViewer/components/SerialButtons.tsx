import React, { useRef, useState } from "react";

export default function SerialButtons() {
  const decoder = useRef(new TextDecoder("utf-8"));
  const encoder = useRef(new TextEncoder());
  const port = useRef<SerialPort>();
  const reader = useRef<ReadableStreamDefaultReader>();
  const writer = useRef<WritableStreamDefaultWriter>();
  const [isConnected, setIsConnected] = useState(false);
  const [isDtrModeEnabled, setIsDtrModeEnabled] = useState(false);
  const [baudRate, setBaudRate] = useState(9600);

  async function connect() {
    try {
      port.current = await navigator.serial.requestPort();
      await port.current.open({ baudRate });
      await port.current.setSignals({
        dataTerminalReady: false,
        requestToSend: false,
      });
      if (port.current.writable && port.current.readable) {
        reader.current = port.current.readable.getReader();
        writer.current = port.current.writable.getWriter();
      }
      setIsConnected(true);
    } catch (error) {
      console.log(error);
      setIsConnected(false);
    }
  }

  function disconnect() {
    try {
      if (reader.current && writer.current && port.current) {
        reader.current.cancel();
        writer.current.abort();
        reader.current.releaseLock();
        writer.current.releaseLock();
        port.current.close();
        port.current = undefined;
        reader.current = undefined;
        writer.current = undefined;
        setIsConnected(false);
        setIsDtrModeEnabled(false);
      }
    } catch (error) {
      console.error(error);
      setIsConnected(true);
    }
  }

  async function read() {
    try {
      if (reader.current) {
        const { value, done } = await reader.current.read();
        if (value) {
          console.log(decoder.current.decode(value));
        }
        if (done) {
          console.log("Read done", done);
        }
      }
    } catch (error) {
      console.error(error);
      disconnect();
    } finally {
      if (reader.current) reader.current.releaseLock();
      // await port.current?.close(); // TODO: Check if this is needed
    }
  }

  async function write(data: string) {
    try {
      if (writer.current)
        await writer.current.write(encoder.current.encode(data));
    } catch (error) {
      console.error(error);
    } finally {
      if (writer.current) writer.current.releaseLock();
    }
  }

  return (
    <div>
      <label>
        Baud Rate
        <input
          type="number"
          value={baudRate}
          onChange={(e) => setBaudRate(parseInt(e.target.value))}
        />
      </label>
      <button onClick={isConnected ? disconnect : connect}>
        {isConnected ? "Disconnect" : "Connect"}
      </button>
    </div>
  );
}