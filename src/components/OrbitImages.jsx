import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import "./OrbitImages.css";

const ellipsePath = (cx, cy, rx, ry) => `M ${cx - rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A ${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;

function OrbitItem({ item, offset, path, progress, ring, onSelect }) {
  const offsetDistance = useTransform(progress, (value) => `${((value + offset) % 100 + 100) % 100}%`);
  return <motion.div className={`orbit-item orbit-item--${ring}`} style={{ offsetPath: `path("${path}")`, offsetDistance, offsetRotate: "0deg" }}>
    <button type="button" className="orbit-card" onClick={() => onSelect?.(item)} aria-label={`查看 ${item.titleCn}`}>
      <span className="orbit-card-media"><img src={item.cover} alt="" draggable={false} /></span>
      <span className="orbit-card-meta"><b>IP {item.index}</b><small>{item.titleCn}</small></span>
    </button>
  </motion.div>;
}

// React Bits OrbitImages adapted for one or several responsive portfolio tracks.
export default function OrbitImages({ items = [], duration = 36, paused = false, onSelect, children, rings = 1 }) {
  const frameRef = useRef(null);
  const [scale, setScale] = useState(null);
  const paths = useMemo(() => [ellipsePath(700, 380, 560, 202), ellipsePath(700, 380, 452, 142), ellipsePath(700, 380, 346, 88)], []);
  const progress = useMotionValue(0);
  const visibleRings = Math.max(1, Math.min(rings, paths.length));
  const orbitItems = items.map((item, index) => ({ item, ring: index % visibleRings, index }));

  useLayoutEffect(() => {
    if (!frameRef.current) return undefined;
    const update = () => setScale(frameRef.current.clientWidth / 1400);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(frameRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || !items.length) return undefined;
    const controls = animate(progress, 100, { duration, ease: "linear", repeat: Infinity, repeatType: "loop" });
    return () => controls.stop();
  }, [duration, items.length, paused, progress]);

  return <div ref={frameRef} className={`orbit-images orbit-images--${visibleRings}-rings`} aria-label="IP works orbit">
    <div className="orbit-images-stage" style={{ transform: scale === null ? undefined : `translate(-50%, -50%) scale(${scale})`, visibility: scale === null ? "hidden" : undefined }}>
      {orbitItems.map(({ item, ring, index }) => {
        const count = orbitItems.filter((entry) => entry.ring === ring).length;
        const position = Math.floor(index / visibleRings);
        return <OrbitItem key={item.id} item={item} ring={ring} offset={(position / count) * 100} path={paths[ring]} progress={progress} onSelect={onSelect} />;
      })}
      {children && <div className="orbit-images-center">{children}</div>}
    </div>
  </div>;
}
