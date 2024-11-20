import React, { useEffect } from 'react'
import { useState } from "react";

import {
  useActionData,

} from "@remix-run/react";
// import { authenticate } from '../shopify.server';
import {
  Card,
  Bleed,
  Button,
  ChoiceList,
  Divider,
  EmptyState,
  InlineStack,
  InlineError,
  Layout,
  Page,
  Text,
  TextField,
  Thumbnail,
  BlockStack,
  PageActions,
} from "@shopify/polaris";
import { ImageIcon } from "@shopify/polaris-icons";
// export async function loader({ request, params }) {
//     const { admin } = await authenticate.admin(request);
  
   
//   }
const ResoucePicker = ({handleUploadImage}) => {
    const errors = useActionData()?.errors || {};
    const [formState, setFormState] = useState("");
    useEffect(()=>{
      handleUploadImage(formState.productImage)
    },[formState])
    async function selectProduct() {
      
        const products = await window.shopify.resourcePicker({
          type: "product",
          action: "select", // customized action verb, either 'select' or 'add',
        });
    
        if (products) {
          const { images, id, variants, title, handle } = products[0];
    
          setFormState({
            ...formState,
            productId: id,
            productVariantId: variants[0].id,
            productTitle: title,
            productHandle: handle,
            productAlt: images[0]?.altText,
            productImage: images[0]?.originalSrc,
          });
        }
      }
  return (
    <div>
     
         {formState.productId ? (
                  <InlineStack blockAlign="center" gap="500">
                    <Thumbnail
                      source={formState.productImage || ImageIcon}
                      alt={formState.productAlt}
                    />
                    <Text as="span" variant="headingMd" fontWeight="semibold">
                      {formState.productTitle}
                    </Text>
                  </InlineStack>
                ) : (
                  <BlockStack gap="200">
                    <Button onClick={selectProduct} id="select-product">
                      Select product
                    </Button>
                    {errors.productId ? (
                      <InlineError
                        message={errors.productId}
                        fieldID="myFieldID"
                      />
                    ) : null}
                  </BlockStack>
                )}
    </div>
  )
}

export default ResoucePicker