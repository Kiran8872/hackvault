export default function SkeletonIdeaRow() {
  return (
    <div className="shimmer" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px', borderRadius: '10px', background: 'var(--s2)', opacity: 0.5, marginBottom: '8px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ height: '14px', width: '60%', background: 'var(--border)', borderRadius: '4px', marginBottom: '6px' }}></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ height: '10px', width: '40px', background: 'var(--border2)', borderRadius: '4px' }}></div>
          <div style={{ height: '10px', width: '60px', background: 'var(--border2)', borderRadius: '4px' }}></div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
        <div style={{ height: '16px', width: '64px', background: 'var(--border)', borderRadius: '99px' }}></div>
        <div style={{ height: '12px', width: '32px', background: 'var(--border2)', borderRadius: '4px' }}></div>
      </div>
    </div>
  );
}
