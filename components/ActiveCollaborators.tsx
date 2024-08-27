// import { useOthers } from '@liveblocks/react/suspense'
import Image from 'next/image';

const ActiveCollaborators = () => {
  const collaborators = [
    { id: '1', name: 'Alice', avatar: 'https://picsum.photos/200/300', color: 'red' },
    { id: '2', name: 'Bob', avatar: 'https://picsum.photos/200/301', color: 'blue' },
    { id: '3', name: 'Charlie', avatar: 'https://picsum.photos/200/302', color: 'green' },
  ];

  // const collaborators = others.map((other) => other.info);

  return (
    <ul className="collaborators-list">
      {collaborators.map(({ id, avatar, name, color }) => (
        <li key={id}>
          <Image 
            src={avatar}
            alt={name}
            width={100}
            height={100}
            className='inline-block size-8 rounded-full ring-2 ring-dark-100'
            style={{border: `3px solid ${color}`}}
          />
        </li>
      ))}
    </ul>
  )
}

export default ActiveCollaborators