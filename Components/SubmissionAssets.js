import { useEffect, useState, useRef } from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import Image from 'next/image';
import { Table, Button, Stack } from 'react-bootstrap';
import { useRoot } from '../contexts/RootContext';
import { isAdmin } from '../lib/users';
import FormImage from './FormImage';
import FormVideo from './FormVideo';
import FormWebsite from './FormWebsite';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import { arrayMoveImmutable } from 'array-move';
import Fancybox from './Fancybox';

const SubmissionAssets = ({ submission, mutate }) => {
  const { user } = useUser();
  const { hideModal, openForm } = useRoot();
  const [ assets, setAssets ] = useState(submission.assets);
  const assetsLoaded = useRef(null);

  const onSubmitAssets = async () => {
    mutate();
    hideModal();
  };

  useEffect(() => {
    setAssets(submission.assets);
  }, [submission.assets]);

  const editAsset = (asset) => {
    const FormComponent = asset.type === 'image' ? FormImage : asset.type === 'video' ? FormVideo : FormWebsite;
    openForm(`Edit ${asset.type}`, <FormComponent submission={submission} assetData={asset} onSubmit={onSubmitAssets} hideModal={hideModal} />);
  };

  const deleteAsset = async (assetId) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/assets/${assetId}`, { method: 'DELETE' });
      mutate();
    }
  };

  const DragHandle = SortableHandle(() => <i className="bi-list fs-2" role="button"></i>);

  const SortableItem = SortableElement(({value}) => <tr>
    {(isAdmin(user) || (submission.userId === user.sub && !submission.submitted)) && <td width="20"><DragHandle /></td>}
    <td style={{minWidth: '80px'}}>{getAssetLink(value)}</td>
    <td>{value.title}</td>
    <td>{value.artist}</td>
    <td>{value.year}</td>
    <td>{value.dimensions || value.duration}</td>
    <td style={{whiteSpace: 'pre-line'}}>{value.description}</td>
    {(isAdmin(user) || (submission.userId === user.sub && !submission.submitted)) && <td>
      <Stack direction="horizontal" gap={1} className="justify-content-end">
        <Button variant="warning" size="sm" onClick={() => editAsset(value)}><i className="bi bi-pencil-fill"></i></Button>
        <Button variant="danger" size="sm" onClick={() => deleteAsset(value._id)}><i className="bi bi-trash-fill"></i></Button>
      </Stack>
    </td>}
  </tr>);

  const SortableList = SortableContainer(({items}) => {
    return (
      <tbody>
        {items.map((value, index) => <SortableItem key={`asset-${value._id}`} index={index} value={value} />)}
      </tbody>
    );
  });

  const onSortEnd = async ({oldIndex, newIndex}) => {
    assetsLoaded.current = true;
    setAssets(arrayMoveImmutable(assets, oldIndex, newIndex));
  };

  useEffect(() => {
    if (assetsLoaded.current) {
      const sortedAssets = assets.map((asset, index) => {
        return {
          _id: asset._id,
          position: index
        }
      });
      fetch('/api/assets/sort', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.sub, assets: sortedAssets })
      });
    }
  }, [assets]);

  const getAssetLink = (asset) => {
    return asset.type === 'image' ? <Image layout="responsive" width={asset.imageWidth} height={asset.imageHeight} src={asset.imageURL} alt={asset.title} data-fancybox="gallery" data-src={asset.imageURL} />
    : asset.type === 'video' ? <a href={asset.url} target="_blank" rel="noreferrer" data-fancybox="gallery" data-src={asset.url}><i className="bi bi-film fs-3"></i></a>
    : asset.type === 'website' ? <a href={asset.url} target="_blank" rel="noreferrer"><i className="bi bi-globe2 fs-3"></i></a>
    : <i className="bi bi-question-circle"></i>
  };

  return (
    <>
      {submission.assets?.length > 0 && <Table size="sm">
        <thead>
          <tr>
            {(isAdmin(user) || (submission.userId === user.sub && !submission.submitted)) && <th>Sort</th>}
            <th style={{minWidth: '80px'}}></th>
            <th>Title</th>
            <th>Artist</th>
            <th>Year</th>
            <th>Properties</th>
            <th>Description</th>
            {(isAdmin(user) || (submission.userId === user.sub && !submission.submitted)) && <th className="text-end">Tools</th>}
          </tr>
        </thead>
        <Fancybox options={{ infinite: false }}>
          <SortableList items={assets} onSortEnd={onSortEnd} useDragHandle={true} />
        </Fancybox>
      </Table>}
      {(isAdmin(user) || (submission.userId === user.sub && !submission.submitted)) && <Stack direction="horizontal" gap={1}>
        <Button variant="primary" onClick={() => openForm('Add Image', <FormImage submission={submission} onSubmit={onSubmitAssets} hideModal={hideModal} />)}>Add Image</Button>
        <Button variant="primary" onClick={() => openForm('Add Video', <FormVideo submission={submission} onSubmit={onSubmitAssets} hideModal={hideModal} />)}>Add Video</Button>
        <Button variant="primary" onClick={() => openForm('Add Website', <FormWebsite submission={submission} onSubmit={onSubmitAssets} hideModal={hideModal} />)}>Add Website</Button>
      </Stack>}
    </>
  );
};

export default SubmissionAssets;